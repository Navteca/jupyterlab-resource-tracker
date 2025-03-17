import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

from jupyterlab_resource_tracker.logs_handler import LogsHandler


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(
            json.dumps(
                {"data": "This is /jupyterlab-resource-tracker/get-example endpoint!"}
            )
        )


def setup_handlers(web_app):
    app_name = "jupyterlab-resource-tracker"
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, app_name, "get-example")
    logs_handler = url_path_join(base_url, app_name, "usages-costs/logs")
    handlers = [
        (route_pattern, RouteHandler),
        (logs_handler, LogsHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)
