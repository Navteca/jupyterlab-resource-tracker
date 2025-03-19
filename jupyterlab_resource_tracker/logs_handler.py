import os
import json
import logging
import sys
import uuid
import boto3
from logging import Logger

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
            required_env_vars = ["OSS_S3_BUCKET_NAME", "OSS_LOG_FILE_PATH"]
            for var in required_env_vars:
                if var not in os.environ:
                    raise EnvironmentError(
                        f"Missing required environment variable: {var}"
                    )

            bucket_name = os.environ["OSS_S3_BUCKET_NAME"]
            local_dir = os.environ["OSS_LOG_FILE_PATH"]

            files = {
                "oss-admin-monthsummary.log": "oss-admin-monthsummary.log",
                "oss-admin.log": "oss-admin.log",
            }

            for filename, s3_key in files.items():
                local_path = os.path.join(local_dir, filename)
                self.download_file_from_s3(bucket_name, s3_key, local_path)

            summary_filename = os.path.join(local_dir, "oss-admin-monthsummary.log")
            details_filename = os.path.join(local_dir, "oss-admin.log")

            logs = self.load_log_file(summary_filename)
            summary_list = SummaryList(summaries=logs)

            logs = self.load_log_file(details_filename)
            details_list = DetailList(details=logs)

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
            self.finish(
                json.dumps(
                    {
                        "summary": [s.model_dump() for s in summary_list.summaries],
                        "details": [d.model_dump() for d in details_list.details],
                    }
                )
            )

    def download_file_from_s3(self, bucket: str, s3_key: str, local_path: str) -> None:
        """
        Download a file from S3 and save it locally.
        """
        s3 = boto3.client("s3")
        try:
            s3.download_file(bucket, s3_key, local_path)
            logger.info(f"Downloaded {s3_key} at {local_path}")
        except boto3.exceptions.S3UploadFailedError as e:
            logger.error(f"AWS S3 upload failed: {e}")
            raise PermissionError("Insufficient permissions for S3 access.")
        except Exception as e:
            logger.error(f"Error while downloading {s3_key}: {e}")
            raise FileNotFoundError(f"Failed to download {s3_key} from S3.")

    def load_log_file(self, file_path: str) -> list:
        """
        Reads a .log file in JSON Lines format and returns a list of objects.
        """
        data = []
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Log file not found: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        if "oss-admin.log" in file_path:
                            obj = json.loads(line)
                            if "session-cost" in obj:
                                obj["session_cost"] = obj.pop("session-cost")
                                data.append(obj)
                        else:
                            data.append(json.loads(line))
                    except json.JSONDecodeError:
                        logger.error(f"Invalid JSON format in {file_path}")
                        raise json.JSONDecodeError("Invalid JSON in log file.", line, 0)
        return data
