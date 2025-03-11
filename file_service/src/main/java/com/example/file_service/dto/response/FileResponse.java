package com.example.file_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileResponse {
    public ObjectId id;
    public String name;
    public String objectName;
    public Long objectId;
    public String content;
}
