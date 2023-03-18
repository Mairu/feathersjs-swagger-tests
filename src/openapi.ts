import swagger, { FnSwaggerUiGetInitializerScript } from 'feathers-swagger';
import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Application } from './declarations';


const getSwaggerInitializerScript: FnSwaggerUiGetInitializerScript = ({ docsJsonPath, ctx, req }) => {
  const headers = (req && req.headers) || (ctx && ctx.headers);
  const basePath = headers!['x-forwarded-prefix'] ?? '';

  // language=JavaScript
  return `
      window.onload = function() {
        var script = document.createElement('script');
        script.onload = function () {
          window.ui = SwaggerUIBundle({
            url: "${basePath}${docsJsonPath}",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset,
              SwaggerUIApiKeyAuthFormPlugin,
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            configs: {
              apiKeyAuthFormPlugin: {
                forms: {
                  BearerAuth: {
                    fields: {
                      email: {
                        type: 'text',
                        label: 'E-Mail-Address',
                      },
                      password: {
                        type: 'password',
                        label: 'Password',
                      },
                    },
                    authCallback(values, callback) {
                      window.ui.fn.fetch({
                        url: '/authentication',
                        method: 'post',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          strategy: 'local',
                          ...values
                        }),
                      }).then(function (response) {
                        const json = JSON.parse(response.data);
                        if (json.accessToken) {
                          callback(null, json.accessToken);
                        } else {
                          callback('error while login');
                        }
                      }).catch(function (err) {
                        console.log(err, Object.entries(err));
                        callback('error while login');
                      });
                    },
                  }
                },
                localStorage: {
                  BearerAuth: {}
                }
              }
            }
          });
        };

        script.src = '${basePath}/swagger-ui-apikey-auth-form.js';
        document.head.appendChild(script)
      };
    `;
};

export default (app: Application) => {
  const router = Router();
  router.get('/swagger-ui-apikey-auth-form.js', function (req: Request, res: Response) {
    res.sendFile(require.resolve('@mairu/swagger-ui-apikey-auth-form/dist/swagger-ui-apikey-auth-form'));
  });
  app.use(router);

  app.configure(swagger.customMethodsHandler);

  app.configure(
    swagger({
      specs: {
        info: {
          title: 'Testing feathers swagger with dove',
          version: '1.0.0',
          description: 'Testing feathers swagger with dove using json schemas and express',
        },
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
        security: [{ BearerAuth: [] }],
      },
      ui: swagger.swaggerUI({ getSwaggerInitializerScript }),
    })
  );
};
