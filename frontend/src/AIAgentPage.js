import React from "react";
import Box from "@material-ui/core/Box";

const AIAgentPage = () => {
  return (
    <Box style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* 這裡指向你的 Streamlit 服務地址 */}
      <iframe
        src="http://172.16.146.196:8502/?embed=true"
        title="ExoCSC AI RAG Agent"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </Box>
  );
};

export default AIAgentPage;