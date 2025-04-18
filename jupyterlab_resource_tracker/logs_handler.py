import os
import json
import logging
import sys
import uuid

import tornado
import tornado.web
from jupyter_server.base.handlers import APIHandler

from pydantic import BaseModel, Field
from typing import List

# Configuring the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Create a handler for the standard output (stdout)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)

# Log formatter
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(console_handler)


class Summary(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    podName: str
    usage: float
    cost: float


class SummaryList(BaseModel):
    summaries: List[Summary]


class Detail(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    podName: str
    creationTimestamp: str
    deletionTimestamp: str
    cpuLimit: str
    memoryLimit: str
    gpuLimit: str
    volumes: str
    namespace: str
    notebook_duration: str
    session_cost: float
    instance_id: str
    instance_type: str
    region: str
    pricing_type: str
    cost: float
    instanceRAM: int
    instanceCPU: int
    instanceGPU: int
    instanceId: str


class DetailList(BaseModel):
    details: List[Detail]


class LogsHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        logger.info("Getting usages and cost stats")
        try:
            # Verificar que las variables de entorno necesarias están definidas
            required_env_vars = ["OSS_LOG_FILE_PATH"]
            for var in required_env_vars:
                if var not in os.environ:
                    raise EnvironmentError(
                        f"Missing required environment variable: {var}"
                    )

            local_path = os.environ["OSS_LOG_FILE_PATH"]
            if not os.path.isfile(local_path):
                raise FileNotFoundError(f"Log file not found: {local_path}")
            logs = self.load_log_file(local_path)
            summary_list = SummaryList(summaries=logs)

        except EnvironmentError as e:
            logger.error(f"Environment configuration error: {e}")
            self.set_status(500)
            self.finish(json.dumps({"error": str(e)}))
        except FileNotFoundError as e:
            logger.error(f"Log file not found: {e}")
            self.set_status(404)
            self.finish(json.dumps({"error": "Required log file not found."}))
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON format in log file: {e}")
            self.set_status(400)
            self.finish(json.dumps({"error": "Invalid log file format."}))
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            self.set_status(500)
            self.finish(json.dumps({"error": "Internal server error."}))
        else:
            self.set_status(200)
            self.finish(json.dumps({"summary": [s.model_dump() for s in summary_list.summaries], "details": []}))

    def load_log_file(self, file_path: str) -> list:
        """
        Reads a .log file in JSON Lines format and returns a list of objects.
        """
        data = []
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        data.append(json.loads(line))
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON format in {file_path}")
            raise json.JSONDecodeError("Invalid JSON in log file.", line, 0)
        except Exception as e:
            logger.error(f"Failed to read {file_path}: {e}")
            raise FileNotFoundError(f"Could not read log file at {file_path}.")
        return data
