import os
import json
import logging
import sys
from logging import Logger

import tornado
import tornado.web
from jupyter_server.base.handlers import APIHandler

from pydantic import BaseModel, Field
from typing import List

# Configurar el logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Asegúrate de que el nivel es INFO o menor

# Crear un handler para la salida estándar (stdout)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)

# Formateador para los logs
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)

# Agregar el handler al logger
logger.addHandler(console_handler)


class Summary(BaseModel):
    id: int
    nbTime: str  # Debe ser una cadena
    username: str
    cost: float  # Debe ser un número decimal


class SummaryList(BaseModel):
    summaries: List[Summary]  # Lista de objetos Summary


class Detail(BaseModel):
    id: int
    username: str
    ec2StandardTime: str
    ec2StandardCost: float
    ec2LargeTime: str
    ec2LargeCost: float
    ec2ExtraTime: str
    ec2ExtraCost: float
    ec22xLargeTime: str
    ec22xLargeCost: float
    ec28xLargeTime: str
    ec28xLargeCost: float
    gpuNodeTime: str
    gpuNodeCost: float


class DetailList(BaseModel):
    details: List[Detail]  # Lista de objetos Detail


# Refresh API Key handler
class LogsHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        # Ahora los logs deberían aparecer en la consola
        logger.info("Getting usages and cost stats")
        logger.info(os.environ["LOG_FILES_PATH"])
        try:
            # Nombre del archivo JSON
            summary_filename = f"{os.environ['LOG_FILES_PATH']}/summary.log"
            details_filename = f"{os.environ['LOG_FILES_PATH']}/details.log"

            # Leer el archivo summary JSON
            with open(summary_filename, "r", encoding="utf-8") as file:
                summary_list = SummaryList(**{"summaries": json.load(file)})

            # Leer el archivo details JSON
            with open(details_filename, "r", encoding="utf-8") as file:
                details_list = DetailList(**{"details": json.load(file)})

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
