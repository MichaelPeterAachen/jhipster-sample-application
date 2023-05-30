package com.myapp.repository;

import com.myapp.domain.Mineral;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mineral entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MineralRepository extends JpaRepository<Mineral, Long> {}
