import React from 'react'
import { Box } from '@mui/material'

const VRAR: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', top: 65, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <iframe
        src="https://vangtien.github.io/VR_THUC-TE-AO"
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
        title="VR Thực Tế Ảo"
      />
    </Box>
  )
}

export default VRAR
