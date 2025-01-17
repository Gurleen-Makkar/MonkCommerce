from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class VideoStreamHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Range')
        
        # Add video streaming headers
        if self.path.endswith('.mov'):
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Type', 'video/quicktime')
        
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        print(f"\nIncoming request:")
        print(f"Path: {self.path}")
        print(f"Headers: {self.headers}")
        
        if self.path.endswith('.mov'):
            try:
                video_path = os.path.join(os.getcwd(), self.path.lstrip('/'))
                file_size = os.path.getsize(video_path)
                
                # Handle range requests
                range_header = self.headers.get('Range')
                if range_header:
                    print(f"Range request: {range_header}")
                    try:
                        # Parse range header
                        start, end = range_header.replace('bytes=', '').split('-')
                        start = int(start)
                        end = int(end) if end else file_size - 1
                        
                        # Send partial content
                        self.send_response(206)
                        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                        self.send_header('Content-Length', str(end - start + 1))
                        self.end_headers()
                        
                        # Send the requested range of bytes
                        with open(video_path, 'rb') as f:
                            f.seek(start)
                            self.wfile.write(f.read(end - start + 1))
                        return
                        
                    except Exception as e:
                        print(f"Error handling range request: {e}")
                        # Fall back to sending entire file
                        pass
                
                # If no range request or error, send entire file
                self.send_response(200)
                self.send_header('Content-Length', str(file_size))
                self.end_headers()
                
                with open(video_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
                
            except Exception as e:
                print(f"Error serving video: {e}")
                self.send_error(500, f"Error serving video: {str(e)}")
                return
        
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    # Set the working directory to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Server working directory: {os.getcwd()}")
    print(f"Available files: {os.listdir('.')}")
    
    server_address = ('', 8001)
    httpd = HTTPServer(server_address, VideoStreamHandler)
    print('Serving at port 8001...')
    httpd.serve_forever()
