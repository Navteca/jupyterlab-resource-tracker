FROM jupyter/base-notebook:latest

USER root
RUN apt-get update \
  && apt-get install -y \
  curl \
  nano \
  vim \
  unzip \
  && apt-get clean \
  && apt-get -y autoremove

RUN pip install --upgrade jupyterlab==4.3.5 
RUN pip install jupyterlab-resource-tracker>=0.2.3 jupyterlab-va-nb-assistant>=0.2.0 jupyterlab-in-platform-support>=0.2.0 jupyterlab-bxplorer>=0.2.0