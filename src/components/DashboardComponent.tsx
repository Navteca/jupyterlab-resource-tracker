import React from 'react';
import {
     Button,
     CssBaseline,
     Divider,
} from '@mui/material';

import Box from '@mui/material/Box';
import SummaryComponent from './SummaryComponent';
import DetailsComponent from './DetailsComponent';
import { requestAPI } from '../handler';
import { Detail, Logs, Summary } from '../common/types';
// import LogsComponent from './LogsComponent';

const DashboardComponent: React.FC = (
     props
): JSX.Element => {
     const [summaryList, setSummaryList] = React.useState<Summary[]>([])
     const [detailList, setDetailList] = React.useState<Detail[]>([])
     React.useEffect(() => {
          getLogs()
     }, []);

     const getLogs = async () => {
          try {
               const response = await requestAPI<Logs>('usages-costs/logs', {
                    method: "GET",
               }).then(data => {
                    console.log(data);
                    return data
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
               console.log(`Error => ${JSON.stringify(error, null, 2)}`)
          }
     }

     const handleClickOpen = () => {
          getLogs()
     };

     return (
          <React.Fragment>
               <Box sx={{ height: '100%', overflowY: 'auto' }}>
                    <Button onClick={handleClickOpen}>REFRESH</Button>
                    <SummaryComponent summary={summaryList}></SummaryComponent>
                    <Divider />
                    <DetailsComponent details={detailList}></DetailsComponent>
                    <Divider />
                    {/* <LogsComponent></LogsComponent> */}
               </Box>
          </React.Fragment>
     );
};

export default DashboardComponent;
<CssBaseline />;







