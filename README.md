# Molecular Hub

> This UI allows for control of the playground through adjustable scheduling of editable playlists of molecules.

Molecular Hub is a companion application for the Molecular Playground Python / Java installation.
By using this application, an installation owner can determine the order of molecules shown for their Molecular Playground.

No complicated screen sharing process is needed to configure the molecule presentation order-
Once the installation application is configured with the unique Hub key associated with their account, the application is able to control what the Playground shows.

1. `git clone <repo>`
2. `docker image build -t hub`
3. `docker container run -it -p 8080:8080`
