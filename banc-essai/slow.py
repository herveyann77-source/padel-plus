import http.server,time,sys,os
os.chdir(sys.argv[1]); SLOW={'on':False}
class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path=='/__slow': SLOW['on']=True; self.send_response(200); self.end_headers(); return
        if SLOW['on'] and (self.path in('/','/index.html')): time.sleep(8)
        return super().do_GET()
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1',8765),H).serve_forever()
