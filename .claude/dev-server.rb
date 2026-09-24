require 'webrick'

server = WEBrick::HTTPServer.new(Port: 8000, DocumentRoot: Dir.pwd)

# Local dev only: disable browser caching so edits always show up on reload.
class WEBrick::HTTPResponse
  alias_method :orig_send_header, :send_header
  def send_header(socket)
    self['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    self['Pragma'] = 'no-cache'
    self['Expires'] = '0'
    self['Clear-Site-Data'] = '"cache"'
    orig_send_header(socket)
  end
end

trap('INT') { server.shutdown }
server.start
