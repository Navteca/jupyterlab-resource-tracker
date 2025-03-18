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
            bucket_name = os.environ["OSS_S3_BUCKET_NAME"]
            files = {
                "oss-admin-monthsummary.log": "oss-admin-monthsummary.log",
                "oss-admin.log": "oss-admin.log",
            }

            # Local directory where the downloaded files will be saved
            local_dir = os.environ["OSS_LOG_FILE_PATH"]

            for filename, s3_key in files.items():
                local_path = os.path.join(local_dir, filename)
                # Download the file from S3
                self.download_file_from_s3(bucket_name, s3_key, local_path)

            summary_filename = (
                f"{os.environ['OSS_LOG_FILE_PATH']}/oss-admin-monthsummary.log"
            )
            details_filename = f"{os.environ['OSS_LOG_FILE_PATH']}/oss-admin.log"

            logs = []
            with open(summary_filename, "r", encoding="utf-8") as file:
                for line in file:
                    line = line.strip()  # removes white spaces and line breaks
                    if line:  # ignore empty lines
                        logs.append(json.loads(line))
            summary_list = SummaryList(**{"summaries": logs})

            logs = []
            with open(details_filename, "r", encoding="utf-8") as file:
                for line in file:
                    line = line.strip()  # removes white spaces and line breaks
                    if line:  # ignore empty lines
                        data = json.loads(line)
                        if "session-cost" in data:
                            data["session_cost"] = data.pop("session-cost")
                        logs.append(data)
            details_list = DetailList(**{"details": logs})

        except Exception as exc:
            logger.info(
                f"Generic exception from {sys._getframe(  ).f_code.co_name} with error: {exc}"
            )
        else:
            self.status_code = 200
            self.finish(
                json.dumps(
                    {
                        "summary": [
                            summary.model_dump() for summary in summary_list.summaries
                        ],
                        "details": [
                            detail.model_dump() for detail in details_list.details
                        ],
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
            print(f"Downloaded {s3_key} at {local_path}")
        except Exception as e:
            print(f"Error while downloading {s3_key}: {e}")

    def load_log_file(self, file_path: str) -> list:
        """
        Reads a .log file in JSON Lines format and returns a list of objects.
        """
        data = []
        with open(file_path, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    data.append(json.loads(line))
        return data
