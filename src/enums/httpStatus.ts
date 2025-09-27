export enum HttpStatus {
    OK                          = 200,
    CREATED                     = 201,
    ACCEPTED                    = 202,
    NO_CONTENT                  = 204,

    // Redirections
    MOVED_PERMANENTLY           = 301,
    FOUND                       = 302,
    NOT_MODIFIED                = 304,

    // Erreurs côté client
    BAD_REQUEST                 = 400,
    UNAUTHORIZED                = 401,
    FORBIDDEN                   = 403,
    NOT_FOUND                   = 404,
    CONFLICT                    = 409,
    UNPROCESSABLE_ENTITY        = 422,

    // Erreurs côté serveur
    INTERNAL_SERVER_ERROR       = 500,
    NOT_IMPLEMENTED             = 501,
    BAD_GATEWAY                 = 502,
    SERVICE_UNAVAILABLE         = 503,
    GATEWAY_TIMEOUT             = 504
    // OK = 200,
    // CREATED = 201,
    // BAD_REQUEST = 400,
    // UNAUTHORIZED = 401,
    // FORBIDDEN = 403,
    // NOT_FOUND = 404,
    // INTERNAL_SERVER_ERROR = 500,
}




