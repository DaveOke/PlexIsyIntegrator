#PlexIsyIntegrator

## Synopsis

This little tool provides a Plex Webhook server which along with a ISY controller will automatially control your theatre lighting.

## Configuration

Edit app.js to enter your ISY credentials. 
Start the service
Set up a plex webhook to point at the service
Start a movie to get your plex client uuid
Register your plex client in app.js, set which lights you want controlled and at what levels

	registerPlexClient("plex_client_uuid", "ISY Device Name", 25, 255, 25, 80);

## License

Licensed under MIT