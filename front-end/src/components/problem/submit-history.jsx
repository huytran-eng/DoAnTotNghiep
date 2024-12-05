import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Modal, styled, Typography } from "@mui/material";
import nullImage from "../../assets/image/null_light.png";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs as themeEditor } from "react-syntax-highlighter/dist/esm/styles/prism";
function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs };
}
const code = "#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\n#include <algorithm>\n\nusing namespace std;\n\nstruct Node {\n    int vertex, weight;\n    Node(int v, int w) : vertex(v), weight(w) {}\n    bool operator>(const Node &other) const {\n        return weight > other.weight;\n    }\n};\n\nstruct Result {\n    int distance;\n    vector<int> path;\n};\n\nResult dijkstra(const vector<vector<Node>> &graph, int start, int end) {\n    int n = graph.size();\n    vector<int> distances(n, INT_MAX);\n    vector<int> previous(n, -1);\n    priority_queue<Node, vector<Node>, greater<Node>> pq;\n\n    distances[start] = 0;\n    pq.push(Node(start, 0));\n\n    while (!pq.empty()) {\n        Node current = pq.top();\n        pq.pop();\n\n        if (current.vertex == end) {\n            vector<int> path;\n            for (int v = end; v != -1; v = previous[v]) {\n                path.push_back(v);\n            }\n            reverse(path.begin(), path.end());\n            return {distances[end], path};\n        }\n\n        for (const auto &neighbor : graph[current.vertex]) {\n            int newDist = distances[current.vertex] + neighbor.weight;\n            if (newDist < distances[neighbor.vertex]) {\n                distances[neighbor.vertex] = newDist;\n                previous[neighbor.vertex] = current.vertex;\n                pq.push(Node(neighbor.vertex, newDist));\n            }\n        }\n    }\n\n    return {INT_MAX, {}};\n}\n\nint main() {\n    int t;\n    cin >> t;\n\n    for (int caseNum = 1; caseNum <= t; ++caseNum) {\n        int n, m, q;\n        cin >> n >> m >> q;\n\n        vector<vector<Node>> graph(n);\n\n        for (int i = 0; i < m; ++i) {\n            int u, v, w;\n            cin >> u >> v >> w;\n            graph[u].emplace_back(v, w);\n            graph[v].emplace_back(u, w);\n        }\n\n        cout << \"Case #\" << caseNum << \":\n\";\n\n        for (int i = 0; i < q; ++i) {\n            int start, end;\n            cin >> start >> end;\n            Result result = dijkstra(graph, start, end);\n\n            if (result.distance == INT_MAX) {\n                cout << \"No path exists between \" << start << \" and \" << end << \"\n\";\n            } else {\n                cout << \"Shortest distance: \" << result.distance << \"\n\";\n                cout << \"Path: \";\n                for (size_t j = 0; j < result.path.size(); ++j) {\n                    if (j > 0) cout << \" -> \";\n                    cout << result.path[j];\n                }\n                cout << \"\n\";\n            }\n        }\n    }\n\n    return 0;\n}";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  maxHeight: "90vh",
  overflowY: "auto",
};
const rows = [
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 9.0, 37),
  createData("AC", "Java", 16.0, 24),
  createData("TLE", "Java", 3.7, 67),
  createData("WA", "Java", 16.0, 40),
  createData("AC", "Java", 6.0, 40),
  createData("AC", "Java", 9.0, 37),
  createData("AC", "Java", 16.0, 20),
  createData("TLE", "Java", 3.7, 63),
  createData("WA", "Java", 16.0, 49),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
];
const SubmitHistory = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };
  return rows.length !== 0 ? (
    <TableContainer
      component={Paper}
      sx={{
        width: "full",
        borderRadius: 0,
        borderEndEndRadius: "0.5rem",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ padding: 0, fontSize: "1rem" }}>
            <TableCell
              sx={{
                padding: 0,
                height: 32,
                fontFamily: "inherit",
                color: "#3c3c4399",
              }}
              align="center"
            >
              Trạng thái
            </TableCell>
            <TableCell
              sx={{
                padding: 0,
                height: 32,
                fontFamily: "inherit",
                color: "#3c3c4399",
              }}
              align="center"
            >
              Ngôn ngữ
            </TableCell>
            <TableCell
              sx={{
                padding: 0,
                height: 32,
                fontFamily: "inherit",
                color: "#3c3c4399",
              }}
              align="center"
            >
              Thời gian chạy
            </TableCell>
            <TableCell
              sx={{
                padding: 0,
                height: 32,
                fontFamily: "inherit",
                color: "#3c3c4399",
              }}
              align="center"
            >
              Bộ nhớ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.carbs}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                  cursor: "pointer",
                },
              }}
              onClick={() => handleOpen(row)}
            >
              <StyledTableCell
                component="th"
                scope="row"
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                align="center"
              >
                <div
                  className={` ${
                    row.name === "AC"
                      ? "text-[#00a650]"
                      : row.name === "TLE"
                      ? "text-[#ffa116]"
                      : "text-[#ff0000]"
                  } `}
                >
                  {row.name}
                </div>
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  color: "#262626bf",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                align="center"
              >
                {row.calories}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  color: "#262626bf",
                  cursor: "pointer",
                }}
                align="center"
              >
                {row.fat} ms
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  color: "#262626bf",
                  cursor: "pointer",
                }}
                align="center"
              >
                {row.carbs} MB
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description">
            <SyntaxHighlighter
              language="cpp"
              style={themeEditor}
              showLineNumbers
            >
              {code}
            </SyntaxHighlighter>
          </Typography>
        </Box>
      </Modal>
    </TableContainer>
  ) : (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <img className="w-[200px]" src={nullImage} alt="null" />
      <h1 className="text-[#3c3c4399]">Không có lịch sử nộp bài</h1>
    </div>
  );
};

export default SubmitHistory;
