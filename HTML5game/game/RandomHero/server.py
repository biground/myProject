from http.server import HTTPServer, CGIHTTPRequestHandler
port = 8084
httpd = HTTPServer(('',port), CGIHTTPRequestHandler)
print('Starting simple httpd on port: ' + str(httpd.server_port))
httpd.serve_forever()