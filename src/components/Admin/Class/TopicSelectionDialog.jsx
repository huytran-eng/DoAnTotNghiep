/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  FormHelperText,
} from "@mui/material";

const TopicSelectionDialog = ({
  open,
  onClose,
  availableTopics = [], // Thêm giá trị mặc định
  onSave,
  openedTopics = [], // Thêm giá trị mặc định
}) => {
  const [localSelectedTopic, setLocalSelectedTopic] = useState("");
  const [localStartDate, setLocalStartDate] = useState("");
  const [localEndDate, setLocalEndDate] = useState("");
  const [errors, setErrors] = useState({
    topic: "",
    startDate: "",
    endDate: "",
  });

  // Reset errors và form khi dialog mở
  useEffect(() => {
    if (open) {
      setLocalSelectedTopic("");
      setLocalStartDate("");
      setLocalEndDate("");
      setErrors({
        topic: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [open]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      topic: "",
      startDate: "",
      endDate: "",
    };

    // Kiểm tra chủ đề đã chọn
    if (!localSelectedTopic) {
      newErrors.topic = "Vui lòng chọn chủ đề";
      isValid = false;
    }

    // Kiểm tra chủ đề đã được mở chưa
    const isTopicOpened = openedTopics.some(
      (topic) => topic.id === localSelectedTopic
    );
    if (isTopicOpened) {
      newErrors.topic = "Chủ đề này đã được mở";
      isValid = false;
    }

    // Validate ngày bắt đầu
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(localStartDate);
    if (!localStartDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
      isValid = false;
    } else if (startDate < today) {
      newErrors.startDate = "Ngày bắt đầu không thể là ngày trong quá khứ";
      isValid = false;
    }

    // Validate ngày kết thúc
    if (!localEndDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
      isValid = false;
    } else {
      const endDate = new Date(localEndDate);
      if (endDate <= startDate) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        topicId: localSelectedTopic,
        startDate: localStartDate,
        endDate: localEndDate,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setLocalSelectedTopic("");
    setLocalStartDate("");
    setLocalEndDate("");
    setErrors({
      topic: "",
      startDate: "",
      endDate: "",
    });
    onClose();
  };

  // Tính toán ngày tối thiểu cho các input date
  const today = new Date().toISOString().split("T")[0];

  // Lọc ra các chủ đề chưa được mở
  const filteredTopics = availableTopics.filter(
    (topic) => !openedTopics.some((opened) => opened.id === topic.id)
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: "500px",
          maxWidth: "90vw",
        },
      }}
    >
      <DialogTitle>Chọn chủ đề</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Select
            value={localSelectedTopic}
            onChange={(e) => setLocalSelectedTopic(e.target.value)}
            fullWidth
            error={!!errors.topic}
            displayEmpty
            sx={{
              mb: errors.topic ? 0.5 : 2,
              minHeight: "56px",
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: "300px",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Chọn chủ đề
            </MenuItem>
            {filteredTopics.map((topic) => (
              <MenuItem key={topic.id} value={topic.id}>
                {topic.name}
              </MenuItem>
            ))}
          </Select>
          {errors.topic && (
            <FormHelperText error sx={{ mb: 1.5 }}>
              {errors.topic}
            </FormHelperText>
          )}

          <TextField
            label="Ngày bắt đầu"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            error={!!errors.startDate}
            helperText={errors.startDate}
            inputProps={{
              min: today,
            }}
            sx={{ mb: errors.startDate ? 0.5 : 2 }}
          />

          <TextField
            label="Ngày kết thúc"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            error={!!errors.endDate}
            helperText={errors.endDate}
            inputProps={{
              min: localStartDate || today,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(TopicSelectionDialog);
