siphon-packager
===========

Building
--------

Ensure that Python 3.4 is installed:

    $ brew install python3

Download virtualenvwrapper to set up our Python 3.4 environment:

    $ pip install virtualenvwrapper
    $ export WORKON_HOME=~/.virtualenv # put this in your .bash_profile too
    $ mkdir -p $WORKON_HOME

Create a virtual environment and activate it:

    $ mkvirtualenv --python=`which python3` siphon-packager
    $ workon siphon-packager
    $ python --version # should be Python 3

Install python dependencies:

    $ pip install -r requirements.txt

Make sure that the latest version of node is installed (4.1.1 as of this
writing)

    $ nvm install node && nvm alias default node

Make siphon-packager.py executable:

    $ chmod +x siphon-packager.py

Usage
-----

In order to run React Native code on a mobile device/simulator, a bundle file
is required that contains all the dependencies of a given app, the source
modules themselves and some polyfills that provide various functions (require()
for example).

The way Siphon currently handles this is to ship the app with
a header file and download the footer from the bundler server, sandwiching in
our own asset code and concatenating them together.

You must run `siphon-packager-install.py` to install any dependencies that the
packagers require (it runs `npm install` under the hood if this hasn't been
done already and starts the packager server). Note that this will also install
the pm2 task manager globally:

    $ ./siphon-packager-install.py

To generate the header file for a given Siphon `base_version` (written
to stdout):

    $ ./siphon-packager.py --header --base-version <base-version> \
      --minify > my-header

Where `<base-version>` could be, for example, `0.2`. Note that this command
defaults to the latest version if the `--base-version` option
is not supplied.

A  `--sandbox` option can be provided with the  `--header` command that
returns an appropriate header file for apps using the sandbox (the Sandbox
itself uses the production header, however).

Footers (0.4 and above)
-----------------------

When generating footers, the footer will be written to a temporary directory.
The return value will be a JSON string of the format

{"ios": {
    "footer": "/path/to/footer",
    "error": "message"
  },
  "android": {
    "footer": "/path/to/footer",
    "error": "message"
  }
 }

If and index.ios.js file is found but there is not index.android.js file,
only an ios parameter will be returned and vice versa. If an index.js entry
file is found, the packager will attempt to build two footers (one for each
platform).


Command to generate footer(s)

    $ ./siphon-packager.py --footer --base-version <base-version> \
      --project-path /path/to/project --minify

Where `--project-path` points to a directory containing an app's
`index.ios.js`, `index.android.js` or `index.js` file.

The `--minify` option can be applied with both the above options to produce
minified output.

Updating node dependencies
------------------------------

When our siphon-dependencies repo is updated with the latest dependencies
for a given version (modules for sandbox and production environments),
packager files need to be updated.

To update relevant packager files, install the developer python dependencies:

    $ pip install -r dev_requirements.txt

Make the update script executable:

    $ chmod +x ./update-dependencies.py

Finally, run the script:

    $ ./update-dependencies.py

Running tests
-------------

Run the test suite:

    $ ./run-tests.py
