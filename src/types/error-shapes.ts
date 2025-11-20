

export type AxiosError<T = any, D = any> = {
  /** The Axios error name (always “AxiosError”). */
  name: 'AxiosError';
  /** Human-readable message summarizing the error (e.g., “Request failed with status code 404”). */
  message: string;
  /** Custom error code (e.g., “ERR_NETWORK”, “ERR_BAD_REQUEST”, etc.). */
  code?: string;
  /** The request configuration used for the request that triggered this error. */
  config: AxiosRequestConfig<D>;
  /** The request object that triggered the error (browser: XMLHttpRequest; Node: http.ClientRequest). */
  request?: XMLHttpRequest | import("http").ClientRequest;
  /** The response object (if any) returned by the server, included when status falls outside success range. */
  response?: AxiosResponse<T, D>;
  /** Flag to indicate this is an Axios error (useful for narrowing). */
  isAxiosError?: true;
  /** Optional stack trace from the underlying Error. */
  stack?: string;
} & Error;


/** The network response shape for a request made by Axios. */
export interface AxiosResponse<T = any, D = any> {
  /** The response payload returned by the server (already deserialized). */
  data: T;
  /** HTTP status code from server response. */
  status: number;
  /** HTTP status text from server response (may be blank under HTTP/2). */
  statusText: string;
  /** HTTP headers from server response (all header names are lower-cased). */
  headers: Record<string, string>;
  /** The Axios request configuration used to make the request. */
  config: AxiosRequestConfig<D>;
  /** The underlying request object that triggered this response.  
   * In browser: `XMLHttpRequest` instance.  
   * In Node.js: latest `http.ClientRequest` (after redirects).  [oai_citation:5‡Axios](https://axios-http.com/docs/res_schema?utm_source=chatgpt.com)  
   */
  request?: XMLHttpRequest | import("http").ClientRequest;
}

/** The Axios request configuration. */
export interface AxiosRequestConfig<D = any> {
  /** The URL for the request. */
  url?: string;
  /** The HTTP method (get, post, put, delete, etc.). */
  method?: string;
  /** The base URL that will be prepended unless `url` is absolute. */
  baseURL?: string;
  /** The request body data (for methods like POST/PUT/PATCH). */
  data?: D;
  /** URL parameters to be sent with the request. */
  params?: Record<string, any>;
  /** Custom headers to be sent. */
  headers?: Record<string, string>;
  /** Timeout in milliseconds for the request. */
  timeout?: number;
  // … plus other lesser-common Axios config options …
}

/** The standard error shape returned by a Lambda function invocation. */
export type LambdaError = {
  /** A human-readable error message. */
  errorMessage: string;
  /** A short identifier for the type of error (often the JS exception name or language-dependent). */
  errorType: string;
  /** 
   * Optional stack trace lines.
   * 
   * For Node.js: each string is typically of the form `"FunctionName (path/to/file:line:column)"`.  
   * For other runtimes (e.g., Python): may be an array of arrays, but commonly represented here as strings.  
   */
  stackTrace?: string[];
  [key: string]: unknown;
}
