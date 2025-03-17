import React from 'react';
import {
     CssBaseline,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Summary } from '../common/types';

interface SummaryComponentProps {
     summary: Summary[]
}

const SummaryComponent: React.FC<SummaryComponentProps> = (
     props
): JSX.Element => {
     const columns: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'username', headerName: 'User', width: 130 },
          { field: 'nbTime', headerName: 'Notebook time', width: 130 },
          { field: 'cost', headerName: 'ToDate Cost ($)', type: 'number', width: 130, },
     ];

     const paginationModel = { page: 0, pageSize: 5 };

     return (
          <React.Fragment>
               <Typography variant="h6" gutterBottom>
                    Costs per User
               </Typography>
               <Paper sx={{ height: 400, width: '100%', mb: 2 }}>
                    <DataGrid
                         rows={props.summary}
                         columns={columns}
                         initialState={{ pagination: { paginationModel } }}
                         pageSizeOptions={[5, 10]}
                         checkboxSelection
                         sx={{ border: 0 }}
                    />
               </Paper>
          </React.Fragment>
     );
};

export default SummaryComponent;
<CssBaseline />;







