# Notes

This a demo app that uses [Phoenix](http://www.phoenixframework.org/) to serve data and [Elm](http://elm-lang.org) to display it in the browser. The following are the notes on how to repeat this yourself. There will be blog post out soon that goes into a bit more detail, so the instructions that follow are pretty bare bones.

Each of the numbered headers should have an associated commit if you want to have a look at the diffs.

## Versions

* Erlang/OTP 18
* Elixir 1.0.5
* Phoenix 1.0.1
* Elm 0.15.1


## Prerequisites

* You'll need to have Postgres installed and running (or see [the Ecto guide](http://www.phoenixframework.org/docs/ecto-models) if you want to try using something else)
* You'll also need to have [Erlang, Elixir and Phoenix installed](http://www.phoenixframework.org/docs/installation)
* Finally, you'll need to have [Elm installed](http://elm-lang.org/install)


## 1. Creating a Phoenix project

Open a terminal and navigate to where you want to create the project. Then do the following;

```bash
mix phoenix.new seat_saver
cd seat_saver

# Create the database for the project
mix ecto.create

# Run the tests to check that everything went according to plan (should be 4 passing)
mix test

# Fire up the Phoenix server and visit http://localhost:4000 in your browser
iex -S mix phoenix.server
```

You should see something like this:

![Phoenix start page](https://www.dropbox.com/s/18lpc1gxl8cw8kb/Screenshot%202015-09-15%2019.07.20.png?dl=0)


## 2. Adding Elm

1. Shutdown the Phoenix server (Ctrl+c twice) so Brunch doesn't build whilst we're setting things up.
2. In the terminal, at the root of the *seat_saver* project we just created, do the following:

  ```bash
    # create a folder for our Elm project inside the web folder
    mkdir web/elm
    cd web/elm

    # install the core and html Elm packages (leave off the -y if you want to see what's happening)
    elm package install -y
    elm package install evancz/elm-html -y
  ```

3. Create a file called *SeatSaver.elm* in the *web/elm* folder and add the following:

  ```elm
  module SeatSaver where

  import Html exposing (..)
  import Html.Attributes exposing (..)


  main =
    view


  view =
    div [ class "jumbotron" ]
      [ h2 [ ] [ text "Hello from Elm!" ]
      , p [ class "lead" ]
        [ text "the best of functional programming in your browser" ]
      ]
  ```

4. Now let's set up Brunch to automatically build the Elm file for us whenever we save changes to it.
5. Add [elm-brunch](https://github.com/madsflensted/elm-brunch) to your *package.json* directly after the `"brunch": <version>` line.

  ```javascript
  {
    ...
    "dependencies": {
      "brunch": "^1.8.5",
      "elm-brunch": "^0.3.0",
      "babel-brunch": "^5.1.1",
      ...
    }
  }
  ```

6. Run `npm install`.
7. Edit your *brunch-config.json* file as follows, making sure that `elmBrunch` is the first plugin:

  ```javascript
  paths: {
    // Dependencies and current project directories to watch
    watched: [
      ...
      "test/static",
      "web/elm/SeatSaver.elm"
    ],
    ...
  },

  ...

  plugins: {
    elmBrunch: {
      elmFolder: 'web/elm',
      mainModules: ['SeatSaver.elm'],
      outputFolder: '../static/vendor'
    },
    ...
  },
  ```

8. Change *web/templates/page/index.html.eex* to the following

  ```html.eex
  <div class="jumbotron">
    <h2>Welcome to Phoenix!</h2>
    <p class="lead">A productive web framework that<br />does not compromise speed and maintainability.</p>
  </div>

  <div id="elm-main">
  </div>
  ```

9. And add the following to *web/static/js/app/js*:

  ```JavaScript
  ...
  var elmDiv = document.getElementById('elm-main'),
      elmApp = Elm.embed(Elm.SeatSaver, elmDiv);
  ```

10. Firing up the Phoenix server again should build the Elm file and output the JavaScript to *web/static/vendor/seatsaver.js* (which will in turn get compiled into *priv/static/js/app.js*).

  ```bash
  cd ../..
  iex -S mix phoenix.server
  ```

11. If you point your browser to [http://localhost:4000](http://localhost:4000) now you should see something like this:

  ![Phoenix with Elm](https://www.dropbox.com/s/wv52p28uy7g73k3/Screenshot%202015-09-15%2019.48.30.png?dl=0)
