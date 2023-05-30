package com.myapp.repository;

import com.myapp.domain.MineralRecommendation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MineralRecommendation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MineralRecommendationRepository extends JpaRepository<MineralRecommendation, Long> {}
