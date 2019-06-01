# kaomoji-slack
A Slack app for kaomoji

# Setup

## Local Development

1. `npm i`
1. Create and fill out `env_files/compose.env`
1. `docker-compose start`
1. In a separate tab, `ngrok http 3000`
1. Copy the domain given by `ngrok` into the Slack Development App, into the
**Interactive Components**, **Slash Commands**, and **OAuth & Permissions** sections.
