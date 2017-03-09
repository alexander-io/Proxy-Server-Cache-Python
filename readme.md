Alexander Harris
Network Programming
Spring 2017

Homework 7: HTTP Web Proxy Server

![cs325](cs325.png "CS 325 Pink Proxy")

I have successfully implemented a python proxy server application.

This proxy will store web data in the cache at the time of the initial request and serve the cached version of the website upon subsequent requests.

I have included a Makefile in the project directory. This currently has one purpose, to remove all of the contents of the cache/ file. In order to clear the cache file, issue $ make clean

To execute the program and start the proxy, issue $ python ProxyServer
By default, the proxy will bind it's socket to 'localhost' but you can alter this by delivering an additional command line argument with the ip, issue $ python ProxyServer <desired i.p.>

Lastly, you can specify the server address and the port via command line arguments by issuing $ python ProxyServer <desired i.p.> <desired port number>, for example :
$ python ProxyServer localhost 8888

In order to successfully run this program on the client side, have the client configure network settings to direct requests through a proxy server at the correct ip and requesting to the correct port, correct —> corresponding the the server configurations.

This proxy also attempts to replace the <body> tag in the existing html with <body style="background-color: pink;">, this results in a modified webpage that's displayed on the client end.

One of my major complications came once I had successfully established & implemented a connection socket. If my server was unable to immediately resolve the request through a single connection, the connection socket would block the subsequent requests necessary to drive the requested site.

  Problem Example :
    Website X takes 10 total html, css, and javascript documents to drive a site.
    The client requests a webpage from the proxy.
    The proxy redirects the client's request to website X.
    Website X responds to the proxy and establishes a connection socket to transmit data.
    The first 3 documents are transmitted from website X to the proxy effectively.
    However, the request for the fourth document cannot be immediately resolved.
    The proxy socket connection remains open & waiting for a resolution for its request (it could be tens of seconds!).
    Since the socket.recv() function is an atomic action, the subsequent socket connections are blocked from service as they also wait on the resolution from the fourth document request.
    This results on the client's end in the requested web page to not be display in the browser in a timely manner.

  Solution :
    After the connection socket has been established from the socket.accept() function call, set a relatively short timeout for the connection. This time is up to your discretion, but it determines how long each connection socket will block before ignoring the request; in my case I set the socket timeout for 1 second. This timeout is set by calling socket.timeout() on the connection socket after the accept() function call has returned the connection socket.

For future work on this assignment (or possibly for some extra credit), I could implement recycling policy when cache file reaches a variable capacity.
