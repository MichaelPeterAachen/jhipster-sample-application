package com.myapp.repository;

import com.myapp.domain.AmountContained;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AmountContained entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AmountContainedRepository extends JpaRepository<AmountContained, Long> {}
