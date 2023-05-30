package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MineralRecommendationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MineralRecommendation.class);
        MineralRecommendation mineralRecommendation1 = new MineralRecommendation();
        mineralRecommendation1.setId(1L);
        MineralRecommendation mineralRecommendation2 = new MineralRecommendation();
        mineralRecommendation2.setId(mineralRecommendation1.getId());
        assertThat(mineralRecommendation1).isEqualTo(mineralRecommendation2);
        mineralRecommendation2.setId(2L);
        assertThat(mineralRecommendation1).isNotEqualTo(mineralRecommendation2);
        mineralRecommendation1.setId(null);
        assertThat(mineralRecommendation1).isNotEqualTo(mineralRecommendation2);
    }
}
