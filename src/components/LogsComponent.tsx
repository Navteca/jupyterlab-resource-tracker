import React from 'react';
import {
     CssBaseline,
} from '@mui/material';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const LogsComponent: React.FC = (
     props
): JSX.Element => {
     return (
          <React.Fragment>
                    <Typography variant="h6" gutterBottom>
                         Usage history per User
                    </Typography>

                    <Paper sx={{ height: 400, width: '100%', mb: 2 }}>
                         <TableContainer component={Paper}>
                              <Table aria-label="collapsible table">
                                   <TableHead>
                                        <TableRow>
                                             <TableCell />
                                             <TableCell>Pod name</TableCell>
                                             <TableCell align="right">Usage&nbsp;(time)</TableCell>
                                             <TableCell align="right">Cost&nbsp;(g)</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody>
                                        {rows3.map((row) => (
                                             <Row key={row.name} row={row} />
                                        ))}
                                   </TableBody>
                              </Table>
                         </TableContainer>
                    </Paper>
          </React.Fragment>
     );
};

function createData(username: string, usage: number, cost: number) {
     const jsonString = `{            
            "history": [
              {
                "podName": "jupyter-rlinan",
                "creationTimestamp": "2025-03-14T01:34:57Z",
                "deletionTimestamp": "2025-03-14T01:36:58Z",
                "cpuLimit": "4",
                "memoryLimit": "4294967296",
                "gpuLimit": "N/A",
                "volumes": "claim-rlinan,efs-smce-oss-oss-efs-pvc",
                "namespace": "oss-oss-hub",
                "notebook_duration": "00:02",
                "session-cost": 0.018548972222222224,
                "instance_type": "r4.xlarge",
                "region": "us-west-2",
                "pricing_type": "spot",
                "cost": 0.0911,
                "instanceRAM": 31232,
                "instanceCPU": 4,
                "instanceGPU": 0
              },
            {
                "podName": "jupyter-rlinan",
                "creationTimestamp": "2025-03-14T01:38:49Z",
                "deletionTimestamp": "2025-03-14T02:41:27Z",
                "cpuLimit": "4",
                "memoryLimit": "17179869184",
                "gpuLimit": "N/A",
                "volumes": "claim-rlinan,efs-smce-oss-oss-efs-pvc",
                "namespace": "oss-oss-hub",
                "notebook_duration": "01:02",
                "session-cost": 0.10645805555555554,
                "instance_type": "r4.xlarge",
                "region": "us-west-2",
                "pricing_type": "spot",
                "cost": 0.0877,
                "instanceRAM": 31232,
                "instanceCPU": 4,
                "instanceGPU": 0
              }
            ]
          }`;

     const jsonObj = JSON.parse(jsonString);
     jsonObj.podName = username;
     jsonObj.usage = usage;
     jsonObj.cost = cost;
     return jsonObj
}

function Row(props: { row: ReturnType<typeof createData> }) {
     const { row } = props;
     const [open, setOpen] = React.useState(false);

     return (
          <React.Fragment>
               <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                         <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => setOpen(!open)}
                         >
                              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                         </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                         {row.podName}
                    </TableCell>
                    <TableCell align="right">{row.usage}</TableCell>
                    <TableCell align="right">{row.cost}</TableCell>
               </TableRow>
               <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                         <Collapse in={open} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                   <Typography variant="h6" gutterBottom component="div">
                                        History
                                   </Typography>
                                   <Table size="small" aria-label="logs">
                                        <TableHead>
                                             <TableRow>
                                                  <TableCell>Pod</TableCell>
                                                  <TableCell>Created at</TableCell>
                                                  <TableCell>Deleted at</TableCell>
                                                  <TableCell align="right">CPU limit</TableCell>
                                                  <TableCell align="right">Memory limit</TableCell>
                                                  <TableCell>GPU limit</TableCell>
                                                  <TableCell>Volumes</TableCell>
                                                  <TableCell>Namespace</TableCell>
                                                  <TableCell>Notebook duration</TableCell>
                                                  <TableCell align="right">Session Cost</TableCell>
                                                  <TableCell>Instance type</TableCell>
                                                  <TableCell>Region</TableCell>
                                                  <TableCell>Princing type</TableCell>
                                                  <TableCell align="right">Cost ($)</TableCell>
                                                  <TableCell align="right">Instance RAM</TableCell>
                                                  <TableCell align="right">Instance CPU</TableCell>
                                                  <TableCell align="right">Instance GPU</TableCell>
                                             </TableRow>
                                        </TableHead>
                                        <TableBody>
                                             {row.history.map((historyRow: any) => (
                                                  <TableRow key={historyRow.creationTimestamp}>
                                                       <TableCell>{historyRow.podName}</TableCell>
                                                       <TableCell>{historyRow.creationTimestamp}</TableCell>
                                                       <TableCell>{historyRow.deletionTimestamp}</TableCell>
                                                       <TableCell align="right">{historyRow.cpuLimit}</TableCell>
                                                       <TableCell align="right">{historyRow.memoryLimit}</TableCell>
                                                       <TableCell>{historyRow.gpuLimit}</TableCell>
                                                       <TableCell>{historyRow.volumes}</TableCell>
                                                       <TableCell>{historyRow.namespace}</TableCell>
                                                       <TableCell>{historyRow.notebook_duration}</TableCell>
                                                       <TableCell align="right">{historyRow['session-cost']}</TableCell>
                                                       <TableCell>{historyRow.instance_type}</TableCell>
                                                       <TableCell>{historyRow.region}</TableCell>
                                                       <TableCell>{historyRow.pricing_type}</TableCell>
                                                       <TableCell align="right">{historyRow.cost}</TableCell>
                                                       <TableCell align="right">{historyRow.instanceRAM}</TableCell>
                                                       <TableCell align="right">{historyRow.instanceCPU}</TableCell>
                                                       <TableCell align="right">{historyRow.instanceGPU}</TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </Box>
                         </Collapse>
                    </TableCell>
               </TableRow>
          </React.Fragment>
     );
}
const rows3 = [
     createData("jupyter-rlinan", 1.0666666666666669, 0.12500702777777778),
     createData("jupyter-lleon", 2.3837501487257219, 0.27980702771234569),
     createData("jupyter-frivas", 1.0345666666666669, 0.12500702759324587),
];

export default LogsComponent;
<CssBaseline />;







