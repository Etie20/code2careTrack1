package com.code2care.reminder.infrastructure.repository;

import com.code2care.common.infrastructure.entites.Reminder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListPagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaFetchReminderRepository extends ListPagingAndSortingRepository<Reminder, Integer> {
    Page<Reminder> findAllByDoctor_Id(Integer doctorId,
                                      Pageable pageable);
    @Query(value = """
        SELECT * FROM reminder r 
        WHERE r.doctor_id = :doctorId
            AND r.type::text = :type

            """,
            countQuery = """
        SELECT COUNT(*) FROM reminder r 
        WHERE r.doctor_id = :doctorId
                    AND r.type::text = :type

                    """,
            nativeQuery = true)

    Page<Reminder> findAllByDoctor_IdAndType(@Param("doctorId") Integer doctorId,@Param("type") String type,
                                             Pageable pageable);
    @Query(value = """
        SELECT * FROM reminder r 
        WHERE  r.type::text = :type

            """,
            countQuery = """
        SELECT COUNT(*) FROM reminder r 
        WHERE r.type::text = :type

                    """,
            nativeQuery = true)
    Page<Reminder> findAllByType(String type,
                                 Pageable pageable);
}