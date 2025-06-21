import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  styled,
} from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import CustomButton from './Button';
import CustomTypography from './Typography';
import { NAVBAR_HEIGHT } from '../../Constants/Common/Dimensions.constants';

const Wrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  gap: '8px',
});

const Accordion = styled(MuiAccordion)({
  width: '100%',
  padding: '0px',
  borderBottom: 'none',
});

const AccordionSummary = styled(MuiAccordionSummary)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0px',
  minHeight: '0px',
  cursor: 'default !important',
});

interface IProps extends DataGridProps {
  count?: number | string;
  countLabel?: string;
}

export default function CustomDataGrid({
  count,
  countLabel = 'items',
  ...props
}: IProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Wrapper>
      <Accordion
        expanded={open}
        sx={{ width: '100%', borderBottom: 'none', padding: 0 }}
        onChange={(e): void => e.stopPropagation()}
      >
        <AccordionSummary>
          <CustomTypography variant="bodySmall" fontWeight="medium">
            {count}
            &nbsp;
            {countLabel}
          </CustomTypography>
          <CustomButton
            variant="subtle"
            label="Manage and export"
            size="small"
            onClick={(): void => setOpen((prev) => !prev)}
            startIcon={
              <SettingsIcon
                style={{
                  transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'all 0.5s cubic-bezier(.19, 1, .22, 1)',
                }}
              />
            }
            sx={{
              marginLeft: 'auto',
            }}
          />
        </AccordionSummary>
        <MuiAccordionDetails>
          <p>Column settings go here</p>
        </MuiAccordionDetails>
      </Accordion>
      <div
        style={{
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          width: '100%',
        }}
      >
        <DataGrid
          columnHeaderHeight={48}
          disableColumnSelector
          disableRowSelectionOnClick
          pageSizeOptions={[]}
          sx={{ width: '100%' }}
          autoPageSize
          {...props}
        />
      </div>
    </Wrapper>
  );
}
