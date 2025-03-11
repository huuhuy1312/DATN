package com.example.file_service.repository;

import com.example.file_service.dto.response.FileResponse;
import com.example.file_service.entity.FileEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends MongoRepository<FileEntity, ObjectId> {

    @Query(value = "{ 'objectName': ?0, 'objectId': ?1, 'isDeleted': false }", fields = "{ 'name' : 1, 'id' : 1, 'objectName': 1, 'objectId': 1 }")
    List<FileResponse> findFileResponsesByObjectNameAndObjectId(String objectName, Long objectId);

}