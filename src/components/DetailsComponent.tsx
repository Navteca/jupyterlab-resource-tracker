import React from 'react';
import {
     CssBaseline,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Detail } from '../common/types';

interface DetailsComponentProps {
     details: Detail[]
}

const DetailsComponent: React.FC<DetailsComponentProps> = (
     props
): JSX.Element => {
     const columns2: GridColDef[] = [
          { field: 'id', headerName: 'ID', width: 50 },
          { field: 'username', headerName: 'User', width: 70 },
          { field: 'ec2StandardTime', headerName: 'Standard (time)', width: 110 },
          { field: 'ec2StandardCost', headerName: 'Standard ($)', type: 'number', width: 110 },
          { field: 'ec2LargeTime', headerName: 'Large (time)', width: 110 },
          { field: 'ec2LargeCost', headerName: 'Large ($)', type: 'number', width: 110 },
          { field: 'ec2ExtraTime', headerName: 'Extra (time)', width: 110 },
          { field: 'ec2ExtraCost', headerName: 'Extra ($)', type: 'number', width: 110 },
          { field: 'ec22xLargeTime', headerName: '2x Large (time)', width: 130 },
          { field: 'ec22xLargeCost', headerName: '2x Large ($)', type: 'number', width: 110 },
          { field: 'ec28xLargeTime', headerName: '8x Large (time)', width: 130 },
          { field: 'ec28xLargeCost', headerName: '8x Large ($)', type: 'number', width: 110 },
          { field: 'gpuNodeTime', headerName: 'GPU Node (time)', width: 130 },
     ];

     const paginationModel = { page: 0, pageSize: 5 };

     return (
          <React.Fragment>
               <Typography variant="h6" gutterBottom>
                    Intances type per User
               </Typography>

               <Paper sx={{ height: 400, width: '100%', mb: 2 }}>
                    <DataGrid
                         rows={props.details}
                         columns={columns2}
                         initialState={{ pagination: { paginationModel } }}
                         pageSizeOptions={[5, 10]}
                         checkboxSelection
                         sx={{ border: 0 }}
                    />
               </Paper>
          </React.Fragment>
     );
};

export default DetailsComponent;
<CssBaseline />;







