package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.AmountContained;
import com.myapp.domain.enumeration.Unit;
import com.myapp.repository.AmountContainedRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AmountContainedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AmountContainedResourceIT {

    private static final Float DEFAULT_AMOUNT = 1F;
    private static final Float UPDATED_AMOUNT = 2F;

    private static final Unit DEFAULT_UNIT = Unit.MG;
    private static final Unit UPDATED_UNIT = Unit.G;

    private static final String ENTITY_API_URL = "/api/amount-containeds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AmountContainedRepository amountContainedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAmountContainedMockMvc;

    private AmountContained amountContained;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AmountContained createEntity(EntityManager em) {
        AmountContained amountContained = new AmountContained().amount(DEFAULT_AMOUNT).unit(DEFAULT_UNIT);
        return amountContained;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AmountContained createUpdatedEntity(EntityManager em) {
        AmountContained amountContained = new AmountContained().amount(UPDATED_AMOUNT).unit(UPDATED_UNIT);
        return amountContained;
    }

    @BeforeEach
    public void initTest() {
        amountContained = createEntity(em);
    }

    @Test
    @Transactional
    void createAmountContained() throws Exception {
        int databaseSizeBeforeCreate = amountContainedRepository.findAll().size();
        // Create the AmountContained
        restAmountContainedMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isCreated());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeCreate + 1);
        AmountContained testAmountContained = amountContainedList.get(amountContainedList.size() - 1);
        assertThat(testAmountContained.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testAmountContained.getUnit()).isEqualTo(DEFAULT_UNIT);
    }

    @Test
    @Transactional
    void createAmountContainedWithExistingId() throws Exception {
        // Create the AmountContained with an existing ID
        amountContained.setId(1L);

        int databaseSizeBeforeCreate = amountContainedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAmountContainedMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isBadRequest());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = amountContainedRepository.findAll().size();
        // set the field null
        amountContained.setAmount(null);

        // Create the AmountContained, which fails.

        restAmountContainedMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isBadRequest());

        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAmountContaineds() throws Exception {
        // Initialize the database
        amountContainedRepository.saveAndFlush(amountContained);

        // Get all the amountContainedList
        restAmountContainedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(amountContained.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())));
    }

    @Test
    @Transactional
    void getAmountContained() throws Exception {
        // Initialize the database
        amountContainedRepository.saveAndFlush(amountContained);

        // Get the amountContained
        restAmountContainedMockMvc
            .perform(get(ENTITY_API_URL_ID, amountContained.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(amountContained.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAmountContained() throws Exception {
        // Get the amountContained
        restAmountContainedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAmountContained() throws Exception {
        // Initialize the database
        amountContainedRepository.saveAndFlush(amountContained);

        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();

        // Update the amountContained
        AmountContained updatedAmountContained = amountContainedRepository.findById(amountContained.getId()).get();
        // Disconnect from session so that the updates on updatedAmountContained are not directly saved in db
        em.detach(updatedAmountContained);
        updatedAmountContained.amount(UPDATED_AMOUNT).unit(UPDATED_UNIT);

        restAmountContainedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAmountContained.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAmountContained))
            )
            .andExpect(status().isOk());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
        AmountContained testAmountContained = amountContainedList.get(amountContainedList.size() - 1);
        assertThat(testAmountContained.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testAmountContained.getUnit()).isEqualTo(UPDATED_UNIT);
    }

    @Test
    @Transactional
    void putNonExistingAmountContained() throws Exception {
        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();
        amountContained.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmountContainedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, amountContained.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isBadRequest());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAmountContained() throws Exception {
        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();
        amountContained.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountContainedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isBadRequest());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAmountContained() throws Exception {
        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();
        amountContained.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountContainedMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAmountContainedWithPatch() throws Exception {
        // Initialize the database
        amountContainedRepository.saveAndFlush(amountContained);

        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();

        // Update the amountContained using partial update
        AmountContained partialUpdatedAmountContained = new AmountContained();
        partialUpdatedAmountContained.setId(amountContained.getId());

        partialUpdatedAmountContained.amount(UPDATED_AMOUNT);

        restAmountContainedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmountContained.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmountContained))
            )
            .andExpect(status().isOk());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
        AmountContained testAmountContained = amountContainedList.get(amountContainedList.size() - 1);
        assertThat(testAmountContained.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testAmountContained.getUnit()).isEqualTo(DEFAULT_UNIT);
    }

    @Test
    @Transactional
    void fullUpdateAmountContainedWithPatch() throws Exception {
        // Initialize the database
        amountContainedRepository.saveAndFlush(amountContained);

        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();

        // Update the amountContained using partial update
        AmountContained partialUpdatedAmountContained = new AmountContained();
        partialUpdatedAmountContained.setId(amountContained.getId());

        partialUpdatedAmountContained.amount(UPDATED_AMOUNT).unit(UPDATED_UNIT);

        restAmountContainedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmountContained.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmountContained))
            )
            .andExpect(status().isOk());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
        AmountContained testAmountContained = amountContainedList.get(amountContainedList.size() - 1);
        assertThat(testAmountContained.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testAmountContained.getUnit()).isEqualTo(UPDATED_UNIT);
    }

    @Test
    @Transactional
    void patchNonExistingAmountContained() throws Exception {
        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();
        amountContained.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmountContainedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, amountContained.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isBadRequest());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAmountContained() throws Exception {
        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();
        amountContained.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountContainedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isBadRequest());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAmountContained() throws Exception {
        int databaseSizeBeforeUpdate = amountContainedRepository.findAll().size();
        amountContained.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmountContainedMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amountContained))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AmountContained in the database
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAmountContained() throws Exception {
        // Initialize the database
        amountContainedRepository.saveAndFlush(amountContained);

        int databaseSizeBeforeDelete = amountContainedRepository.findAll().size();

        // Delete the amountContained
        restAmountContainedMockMvc
            .perform(delete(ENTITY_API_URL_ID, amountContained.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AmountContained> amountContainedList = amountContainedRepository.findAll();
        assertThat(amountContainedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
