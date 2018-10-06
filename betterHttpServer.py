# -*- coding: utf-8 -*-
#test on python 3.4 ,python of lower version  has different module organization.
import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
from optparse import OptionParser




parser = OptionParser()
parser.add_option("-p", "--port", dest="PORT",
                  help="change the PORT", metavar="PORT")


(options, args) = parser.parse_args()

print(options.PORT)

PORT = int(options.PORT) or 8080

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={
        '.manifest': 'text/cache-manifest',
	'.html': 'text/html',
        '.png': 'image/png',
	'.jpg': 'image/jpg',
	'.svg':	'image/svg+xml',
	'.css':	'text/css',
	'.js':	'application/x-javascript',
	'': 'application/octet-stream', # Default
    }

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()
