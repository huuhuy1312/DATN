package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    @Query("SELECT c FROM Customer c WHERE c.account.id = :idAcc")
    Customer findByAccountId(@Param("idAcc") Long idAcc);
}
