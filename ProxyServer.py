# Alexander Harris
# Network Programming
# Spring 2017
# Homework 7: HTTP Web Proxy Server

from socket import *
import sys
import re
import os

# For this assignment you'll create a simple proxy server. Your
# network settings should be set to point to localhost port 8888
# for a proxy server.
# Your proxy server should work with simple html web pages. Streaming
# or other content would require a more sophisticated proxy. You can
# test your proxy out on www.something.com and the course website here:
# http://mathcs.pugetsound.edu/~tmullen/classes/s17-CS325-nw/ both of
# which should work without too much trouble. I encourage you to see
# how your proxy handles other, more complex pages, and consider what
# modifications would be necessary to deal with them.

# Our program will be structured a little more properly than previous
# Python scripts. Using a main function and calling it as shown at the
# bottom of this program with if __name__=="__main__": is the recommended
# way to write standalone Python programs. Among other advantages, it
# enables us to define functions "after" they are called, which is
# otherwise not possible in Python.

def main():
	# the address to bind the socket to will either come in from a command line argument, or be defaulted to 'localhost'
	if len(sys.argv) <= 1:
		print('Usage : "python ProxyServer.py <server_ip>"\n<server_ip> is the IP address of the proxy server (e.g. localhost)')
		serverAddress = 'localhost'
	else :
		serverAddress = sys.argv[1]

	# similarly, bind the server port to 8888 by default, or take the command line argument
	if len(sys.argv) == 3 :
		# bind the port according to the second command line argument
		serverPort = int(sys.argv[2])
	else :
		# else use the default port of 8888
		serverPort = 8888

	print('address command line arg : ', serverAddress)

	# init server socket
	clientSocket = socket(AF_INET, SOCK_STREAM)
	clientSocket.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)

	# bind the serverAddress to the serverPort
	clientSocket.bind((serverAddress, serverPort))

	# ask the socket to listen for connections,
	# the parameter is the 'backlog' which is the number of connections to queue
	clientSocket.listen(100)

	while 1:
		# ready to serve...
		print('||||||||||||||||||||||||||||||||||||||||||||||||||||\n\t\tReady to serve...\n||||||||||||||||||||||||||||||||||||||||||||||||||||')

		# Accept a connection from the client.
		connectionSocket, addr = clientSocket.accept()

		# NOTE - I was having a persistent issue where my socket
		# was blocking when requesting certain data that couldn't
		# be fulfilled. It seems that the recv() function happens
		# to be a blocking atomic action, that's to say that if
		# data cannot immediately be received through recv()
		# invocation, the thread will hault execution and the
		# subsequent connections will wait until the blocked
		# recv() is resolved. This is a HUGE problem and it
		# resulted in blocked request in my browser that would
		# only be resolved through a LONG timeout. I was able
		# to remedy this bug by setting a timeout for the
		# connection socket that is relatively short (1 second)
		# in my case. This will kill/ignore any connectionSocket
		# that takes longer than 1 second to resolve its recv()
		# invocation.
		connectionSocket.settimeout(1.0)

		# print connection address info
		print('Received a connection from :  %s\n' % str(addr))

		# Receive the message from the client socket. This will be an HTTP request from the browser.
		message = ''
		try :
			message = connectionSocket.recv(1024).decode()
		except (BlockingIOError, timeout) as e:
			# handle blocking & timeouts with a continuation of the while loop
			continue

		# Before anything else, let's ignore the Sophos antivirus
		# requests that will otherwise be spamming our proxy server.
		if re.match(r'sophosxl', message):
			print('passing this GET request for sophos...')
			pass

		# also ignore anything related to favicon.ico
		elif ('favicon' in message):
			print('passing this GET request for favicon...')
			pass
		elif ('sophos' in message):
			print('further ignore sophos')
			pass
		elif('audio' in message):
			print('there\'s an audio request here, pass on it')
			pass

		# Next, we'll ensure that the proxy only handles GET
		# requests. You may have network applications running
		# behind the scenes (e.g. Dropbox, updates, etc) that
		# might try to make other HTTP requests. Those will be
		# effectively disabled while your settings are pointing
		# to this proxy. Note I'm using a regular expression match
		# here, which is provided by the re module.
		elif re.match(r'^GET ', message):
			# this is a valid get, so print out connection socket info
			print('connectionSocket \t:::::\t', connectionSocket)
			# print out the message data
			print('\n||||||||||||||||\nmessage data : \n||||||||||||||||\n%s' % message)
			# handleGETReq is defined below. Pass it what it needs
			handleGETReq(connectionSocket, message)
		else:
			pass

		# Close the client and the server sockets
		connectionSocket.close()

def handleGETReq(connectionSocket, message):
	# Use Python string processing to split the message.
	# When strings are split, the output is an array whose elements
	# can be accessed by index, like: my_array[2]
	tokenz = message.split(" ")
	cachefile =  'cache/' + tokenz[1].replace('/', '~')
	print('cache file :', cachefile)
	print('host tokenz[3] : ', tokenz[3])

	url = tokenz[3]
	sub_directory = tokenz[1]
	try:

		# Check whether the appropriate file exists in the cache.
		# We do this in a try block so that if the file is not present
		# we'll execute whats in the except block instead.

		# cachefile will be the name of the file you created when you
		# initially cached this website. It should be derived from the
		# website's name, but unfortunately it can't contain any "/"
		# symbols. I also assume that these are being kept in a directory
		# called "cache". There's an empty directory with this name
		# already created in the starter code directory.
		# print('\n\ncache file ::: cache/'+cachefile)
		# f = open('cache/' + cachefile, "r")

		# Assuming that there is a file, we need to read it in
		# and send its content to the client socket. Did you pass
		# the socket to this function? You should.

		# try to open and read the file into file_content variable
		f = open(cachefile, "r")
		file_content = f.read()
		f.close()

		# we've got the file in cache, let's generate a header and send it along with the file_content to the client
		response = '\nHTTP/1.1 200 OK\n\n' + file_content
		print('found file in cache...\nresponse : ', response)

		# send the data to the client
		connectionSocket.send(response.encode('utf-8'))
		connectionSocket.close()

	# If the file isn't found in the cache
	except IOError:
		print('\ncould not find the file in the cache, going to the remote server to get it...\n')
		# If there's no cache file, we'll need to get the
		# web page from its original source. So we'll need
		# to create a new TCP socket to connect to the
		# web server and make the HTTP request.
		print('\n\nmake remote server socket...')
		# create a new socket in order to make a request to the remote server
		remoteServerSocket = socket(AF_INET, SOCK_STREAM)
		print('\n\nremote server socket \t\t:::::\t', remoteServerSocket)

		try:
			# Connect to the socket to port 80 on the domain
			# where the website resides.
			print('getting IPP hostname from url... url : ', url)

			# testing in local host case
			# if 'localhost' in url:
			# 	url = 'www.something.com'



			# use a regular expression sequence to derive the www.hostname.com pattern
			# this is necessary because the proxy connection can modify the incoming url string
			result_url = ''

			# if url contains 'com', set com to 'com', otherwise 'edu', 'io'
			if ('.com' in url):
				com = re.search('.com', url)
			elif ('.edu' in url):
				com = re.search('.edu', url)
				# else if url contains 'edu', set com to 'edu'
			elif ('.io' in url):
				com = re.search('.io', url)
			elif ('.org' in url):
				com = re.search('.org', url)
			elif ('.net' in url):
				com = re.search('.net', url)

			# now let's get the start of the url string
			i = 0
			if ('http' in url):
				www = re.search('http', url)
				i = www.start()
			elif ('www' in url):
				www = re.search('www', url)
				i = www.start()

			# loop through the string that contains the url...
			while(i<com.end()):
				# for each valid character, append it to our url-string
				result_url+=url[i]
				i+=1

			print('\nurl : %s\n' % url)

			# get the ip address of the url
			remoteServerHost = gethostbyname(result_url)

			# print remote server host ip
			print('\n\nremote server host ip \t\t:::::\t ', remoteServerHost)

			# make the connection to the remote server on port 80
			remoteServerSocket.connect((remoteServerHost, 80))
			print('\n\nremote server connection \t:::::\t ', remoteServerSocket)

			# Create a well-formed, minimal HTTP GET request.
			remoteServerRequest = 'GET '+sub_directory +'\r\nHost: '+remoteServerHost+'\r\nConnection: close\r\n\r\n'

			# Send the request to the web server
			print('sending well-formed, minimal get request...', remoteServerRequest)
			remoteServerSocket.send(remoteServerRequest.encode('utf-8'))

			# loop to collect the packets that form the response.
			response = b""
			while True:

				# Append the packets to the response
				data = remoteServerSocket.recv(2048)
				response+=data

				# This will break out of the loop when the
				# response data stops coming
				if not data: break

			print("Response from server:")
			print(response.decode())

			# Create the cache file. Remember, your cachefile name
			# should be easily derivable (probably by simple substring
			# substitution) from the url, but must not include "/" characters.
			print('creating new temp file...')
			file_path = cachefile
			print('file path ::::::: ', file_path)
			tmpFile = open(file_path,"w")

			# You want to write your response to the file,
			# but first let's do a quick and dirty modification
			# to it so that we can tell at a glance whether
			# it's the cached version.
			# The following regular expression substitution will
			# take the <body> tag and insert a CSS style tag to make
			# the background pink.
			response = response.decode()
			response = response.replace('<body>', '<body style="background-color:pink;">')
			print('writing to new temp file...')
			tmpFile.write(response)
			print('done writing to tmp file...')

			# generate http response header
			response = '\nHTTP/1.1 200 OK\n\n' + response

			# print response to client
			print('response : ', response)

			# finally, send response to client
			connectionSocket.send(response.encode('utf-8'))
			remoteServerSocket.close()
			connectionSocket.close()
			tmpFile.close()

		except:
			# This should be called if anything in the previous
			# block goes wrong.
			print("Illegal request")
			if (connectionSocket) : connectionSocket.close()
			if (remoteServerSocket) : remoteServerSocket.close()

# Execute main if this is a free-standing program rather
# than a module, which it is.
if __name__=="__main__":
   main()
