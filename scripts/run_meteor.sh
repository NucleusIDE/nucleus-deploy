#!/bin/bash

git_pull_app_repo() {
  # it pulls the cloned repo dir if it already exists
  DIR=./<%= appName %>_cloned
  if [ -d "$DIR" ]; then
    cd ${DIR}
    git pull
    cd ..
  else
    git clone <%= gitUrl %> <%= appName %>_cloned
  fi
}

install_meteor_if_not_exists () {
  if hash meteor 2>/dev/null; then
    echo "Meteor exists."
  else
    curl https://install.meteor.com | /bin/sh
  fi
}

# logic
# set -e

CLONE_DIR=<%= devDeployDir %>
mkdir -p $CLONE_DIR

cd ${CLONE_DIR}

install_meteor_if_not_exists

git_clone_app_repo
git_clone_unpublished_packages

<% for(var key in env) { %>
    export <%- key %>=<%- env[key] %>
    <% } %>

  . pkill node || true

  cd ${CLONE_DIR}/<%= appName %>

  nohup meteor --port <%= devPort %> > /dev/null 2>&1

  echo "Meteor must be running."
