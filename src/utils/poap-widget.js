module.exports = function loadPoapWidget() {
  var regex = /\.([0-9a-z]+)(?:[\?#]|$)/i
  var files = [
    '/lib/5b77e34/index.css',
    '/lib/5b77e34/vendors.js',
    '/lib/5b77e34/poap-widget.js',
    '/lib/5b77e34/poap-widget.css',
  ]
  for (var i = 0; i < files.length; i++) {
    var file = files[i]
    var extension = file.match(regex)

    switch (extension?.[1]) {
      case 'js': {
        const script = document.createElement('script')
        script.src = file
        script.defer = true
        document.body.appendChild(script)
        break
      }
      case 'css': {
        const link = document.createElement('link')
        link.href = file
        link.rel = 'stylesheet'
        document.head.appendChild(link)
        break
      }
    }
  }
}
