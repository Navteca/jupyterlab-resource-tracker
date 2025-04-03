import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SummaryComponent from './SummaryComponent';
// import DetailsComponent from './DetailsComponent';
import { requestAPI } from '../handler';
import { Logs, Summary } from '../common/types';
import { showErrorMessage } from '@jupyterlab/apputils';

const DashboardComponent: React.FC = (): JSX.Element => {
  const [summaryList, setSummaryList] = React.useState<Summary[]>([]);
  // const [detailList, setDetailList] = React.useState<Detail[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    setLoading(true);
    try {
      const response = await requestAPI<Logs>('usages-costs/logs', {
        method: 'GET',
      });

      if (response) {
        setSummaryList(response.summary);
        // setDetailList(response.details);
      }
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      let errorMessage = 'An unexpected error occurred.';

      if (error && error.response && error.response.status) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid log file format. Please check the logs.';
            break;
          case 404:
            errorMessage = 'Log files not found. Ensure they exist in the configured path.';
            break;
          case 500:
            console.error('Error response from server:', error.response);
            errorMessage =
              'Server error: ' +
              (error.response.data?.error || 'Unknown issue');
            break;
          default:
            errorMessage = error.response.data?.error || 'Unexpected error.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showErrorMessage('Error Fetching Logs', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard</Typography>
          <Tooltip title="Refresh Data">
            <IconButton color="inherit" onClick={getLogs} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, height: '92%', overflowY: 'auto' }}>
        <SummaryComponent summary={summaryList} loading={loading} />
        {/* <Box sx={{ my: 2 }} />
        <DetailsComponent details={detailList} loading={loading} /> */}
      </Box>
    </React.Fragment>
  );
};

export default DashboardComponent;
