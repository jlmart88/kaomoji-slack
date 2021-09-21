# kaomoji-slack

A Slack app for kaomoji

# Setup

## Local Development

1. `npm i`
1. Create and fill out `env_files/compose.env` using the credentials from **App Settings** > **Basic Information**
1. `docker-compose up`
1. In a separate tab, `ngrok http 3000`
1. Copy the domain given by `ngrok` into the Slack Development App, into the
   **Interactivity & Shortcuts**, **Slash Commands**, and **OAuth & Permissions** sections.
1. Changes will be applied from tear down + restarting docker.
1. Teardown: `docker-compose down`

Accessing the database:

1. Get the ID of the service running MongoDB by running `docker-compose ps -q`
1. Run `docker exec -it <service-id> /bin/sh`
1. In the docker shell run `mongo <MONGODB_URI>` using the URI from the .env file.
