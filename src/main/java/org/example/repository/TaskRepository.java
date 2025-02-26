package org.example.repository;

import org.example.constants.TaskStatus;
import org.example.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    List<TaskEntity> findAllByDueDate(Date dueDate);

    List<TaskEntity> findAllByStatus(TaskStatus status);
}
