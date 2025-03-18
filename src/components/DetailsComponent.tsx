import React from 'react';
import { Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Detail } from '../common/types';

interface DetailsComponentProps {
  details: Detail[];
  loading: boolean;
}

const DetailsComponent: React.FC<DetailsComponentProps> = (props): JSX.Element => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 150 },
    { field: 'podName', headerName: 'Pod Name', width: 150 },
    { field: 'creationTimestamp', headerName: 'Created at', width: 170 },
    { field: 'deletionTimestamp', headerName: 'Deleted at', width: 170 },
    { field: 'cpuLimit', headerName: 'cpuLimit', width: 90 },
    { field: 'memoryLimit', headerName: 'memoryLimit', width: 100 },
    { field: 'gpuLimit', headerName: 'gpuLimit', width: 90 },
    { field: 'volumes', headerName: 'Volumes', width: 170 },
    { field: 'namespace', headerName: 'Namespace', width: 110 },
    { field: 'notebook_duration', headerName: 'Notebook duration', width: 150 },
    { field: 'session_cost', headerName: 'Session cost ($)', type: 'number', width: 150 },
    { field: 'instance_type', headerName: 'Instance type', width: 110 },
    { field: 'region', headerName: 'Region', width: 80 },
    { field: 'pricing_type', headerName: 'Pricing type', width: 110 },
    { field: 'cost', headerName: 'Cost ($)', width: 80 },
    { field: 'instanceRAM', headerName: 'RAM', type: 'number', width: 70 },
    { field: 'instanceCPU', headerName: 'CPU', type: 'number', width: 70 },
    { field: 'instanceGPU', headerName: 'GPU', type: 'number', width: 70 },
    { field: 'instanceId', headerName: 'instanceId', width: 170 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Costs by Instance
      </Typography>
      <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2, mb: 2 }}>
        <DataGrid
          autoHeight
          rows={props.details}
          columns={columns}
          loading={props.loading}
          initialState={{
            pagination: { paginationModel },
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </React.Fragment>
  );
};

export default DetailsComponent;
