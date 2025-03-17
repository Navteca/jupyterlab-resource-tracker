import React from 'react';
import { Divider, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Detail } from '../common/types';

const DetailsComponent: React.FC<{ details: Detail[] }> = (props): JSX.Element => {
  const columnsCosts: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'username', headerName: 'User', width: 70 },
    { field: 'ec2StandardCost', headerName: 'Standard ($)', type: 'number', width: 110 },
    { field: 'ec2LargeCost', headerName: 'Large ($)', type: 'number', width: 110 },
    { field: 'ec2ExtraCost', headerName: 'Extra ($)', type: 'number', width: 110 },
    { field: 'ec22xLargeCost', headerName: '2x Large ($)', type: 'number', width: 110 },
    { field: 'ec28xLargeCost', headerName: '8x Large ($)', type: 'number', width: 110 },
  ];

  const columnsTime: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'username', headerName: 'User', width: 70 },
    { field: 'ec2StandardTime', headerName: 'Standard (time)', width: 130 },
    { field: 'ec2LargeTime', headerName: 'Large (time)', width: 130 },
    { field: 'ec2ExtraTime', headerName: 'Extra (time)', width: 130 },
    { field: 'ec22xLargeTime', headerName: '2x Large (time)', width: 130 },
    { field: 'ec28xLargeTime', headerName: '8x Large (time)', width: 130 },
    { field: 'gpuNodeTime', headerName: 'GPU Node (time)', width: 130 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Costs by Server type
      </Typography>
      <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2, mb: 2 }}>
        <DataGrid
          autoHeight
          rows={props.details}
          columns={columnsCosts}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Time by Server type
      </Typography>
      <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2, mb: 2 }}>
        <DataGrid
          autoHeight
          rows={props.details}
          columns={columnsTime}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </React.Fragment>
  );
};

export default DetailsComponent;
