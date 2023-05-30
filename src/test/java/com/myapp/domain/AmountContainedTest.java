package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AmountContainedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AmountContained.class);
        AmountContained amountContained1 = new AmountContained();
        amountContained1.setId(1L);
        AmountContained amountContained2 = new AmountContained();
        amountContained2.setId(amountContained1.getId());
        assertThat(amountContained1).isEqualTo(amountContained2);
        amountContained2.setId(2L);
        assertThat(amountContained1).isNotEqualTo(amountContained2);
        amountContained1.setId(null);
        assertThat(amountContained1).isNotEqualTo(amountContained2);
    }
}
