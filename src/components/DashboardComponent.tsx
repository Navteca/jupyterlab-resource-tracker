import React from 'react';
import {
  Button,
  CssBaseline,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import SummaryComponent from './SummaryComponent';
import DetailsComponent from './DetailsComponent';
import { requestAPI } from '../handler';
import { Detail, Logs, Summary } from '../common/types';

const DashboardComponent: React.FC = (props): JSX.Element => {
  const [summaryList, setSummaryList] = React.useState<Summary[]>([]);
  const [detailList, setDetailList] = React.useState<Detail[]>([]);

  React.useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    try {
      const response = await requestAPI<Logs>('usages-costs/logs', {
        method: "GET",
      }).then(data => {
        console.log(data);
        return data;
      }).catch(reason => {
        console.error(
          `The jupyterlab_resource_tracker server extension appears to be missing.\n${reason}`
        );
      });
      if (response) {
        setSummaryList(response.summary);
        setDetailList(response.details);
      }
    } catch (error) {
      console.log(`Error => ${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
        <Button 
          onClick={getLogs} 
          variant="contained" 
          color="primary" 
          sx={{ mb: 2 }}
        >
          REFRESH
        </Button>
        <SummaryComponent summary={summaryList} />
        <Divider sx={{ my: 2 }} />
        <DetailsComponent details={detailList} />
        <Divider sx={{ my: 2 }} />
      </Box>
    </React.Fragment>
  );
};

export default DashboardComponent;
