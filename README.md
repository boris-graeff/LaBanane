# LaBanane
Application web pour créer des playlists à partir de différentes sources (Youtube, Soundcloud, etc.).


## Install


    git clone git@github.com:boris-graeff/LaBanane.git
    cd LaBanane
    # intall mongodb
    npm start

## Docker

    cd LaBanane
    docker build -t labanane .
    docker run -p 6464:6464 --rm --name labanane labanane
    # docker run -p 6464:6464 --rm --name labanane --restart unless-stopped labanane
    # docker stop labanane; and docker rm -f labanane

### Todo 

- [ ] create mongodb repo/_Dockerfile_ ;
- [ ] create a _docker-compose.yml_ to manage all.
