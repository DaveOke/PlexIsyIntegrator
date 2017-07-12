#PlexIsyIntegrator

## Synopsis

This little tool provides a Plex Webhook server which along with a ISY controller will automatially control your theatre lighting.

## Configuration

Edit app.js to enter your ISY credentials. 
Start the service
Set up a plex webhook to point at the service
Start a movie to get your plex client uuid
Register your plex client in config.js, set which lights you want controlled and at what levels

	{
	  "plexWebhookPort": 90,
	  "isyAddress": "https://10.0.1.5",
	  "isyUsername": "admin",
	  "isyPassword": "admin",
	  "plexClients": [
		{
		  "uuid": "abc123",
		  "isyNodeName": "Theatre Lights",
		  "playLightLevel": 25,
		  "stopLightLevel": 180,
		  "resumeLightLevel": 25,
		  "pauseLightLevel": 80
		}
	  ], [{...next plex client...}]
	}

## Installation

Requires Node.JS & NPM:
	* Install forever, forever-service to run an a system service
	* Clone to your folder
	* Run npm install
	* use node.js to run app.js.
	* Once configuered, use forever-service to install as a system service.

## License

Licensed under MIT