package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.MineralRecommendation;
import com.myapp.domain.enumeration.RecommendationPeriodTime;
import com.myapp.domain.enumeration.Unit;
import com.myapp.repository.MineralRecommendationRepository;
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
 * Integration tests for the {@link MineralRecommendationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MineralRecommendationResourceIT {

    private static final Float DEFAULT_MIN_AMOUNT = 1F;
    private static final Float UPDATED_MIN_AMOUNT = 2F;

    private static final Float DEFAULT_MAX_AMOUNT = 1F;
    private static final Float UPDATED_MAX_AMOUNT = 2F;

    private static final Unit DEFAULT_UNIT = Unit.MG;
    private static final Unit UPDATED_UNIT = Unit.G;

    private static final Long DEFAULT_TIME_PERIOD_LENGTH = 1L;
    private static final Long UPDATED_TIME_PERIOD_LENGTH = 2L;

    private static final RecommendationPeriodTime DEFAULT_TIME_PERIOD_DIMENSION = RecommendationPeriodTime.HOURS;
    private static final RecommendationPeriodTime UPDATED_TIME_PERIOD_DIMENSION = RecommendationPeriodTime.DAYS;

    private static final String ENTITY_API_URL = "/api/mineral-recommendations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MineralRecommendationRepository mineralRecommendationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMineralRecommendationMockMvc;

    private MineralRecommendation mineralRecommendation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MineralRecommendation createEntity(EntityManager em) {
        MineralRecommendation mineralRecommendation = new MineralRecommendation()
            .minAmount(DEFAULT_MIN_AMOUNT)
            .maxAmount(DEFAULT_MAX_AMOUNT)
            .unit(DEFAULT_UNIT)
            .timePeriodLength(DEFAULT_TIME_PERIOD_LENGTH)
            .timePeriodDimension(DEFAULT_TIME_PERIOD_DIMENSION);
        return mineralRecommendation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MineralRecommendation createUpdatedEntity(EntityManager em) {
        MineralRecommendation mineralRecommendation = new MineralRecommendation()
            .minAmount(UPDATED_MIN_AMOUNT)
            .maxAmount(UPDATED_MAX_AMOUNT)
            .unit(UPDATED_UNIT)
            .timePeriodLength(UPDATED_TIME_PERIOD_LENGTH)
            .timePeriodDimension(UPDATED_TIME_PERIOD_DIMENSION);
        return mineralRecommendation;
    }

    @BeforeEach
    public void initTest() {
        mineralRecommendation = createEntity(em);
    }

    @Test
    @Transactional
    void createMineralRecommendation() throws Exception {
        int databaseSizeBeforeCreate = mineralRecommendationRepository.findAll().size();
        // Create the MineralRecommendation
        restMineralRecommendationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isCreated());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeCreate + 1);
        MineralRecommendation testMineralRecommendation = mineralRecommendationList.get(mineralRecommendationList.size() - 1);
        assertThat(testMineralRecommendation.getMinAmount()).isEqualTo(DEFAULT_MIN_AMOUNT);
        assertThat(testMineralRecommendation.getMaxAmount()).isEqualTo(DEFAULT_MAX_AMOUNT);
        assertThat(testMineralRecommendation.getUnit()).isEqualTo(DEFAULT_UNIT);
        assertThat(testMineralRecommendation.getTimePeriodLength()).isEqualTo(DEFAULT_TIME_PERIOD_LENGTH);
        assertThat(testMineralRecommendation.getTimePeriodDimension()).isEqualTo(DEFAULT_TIME_PERIOD_DIMENSION);
    }

    @Test
    @Transactional
    void createMineralRecommendationWithExistingId() throws Exception {
        // Create the MineralRecommendation with an existing ID
        mineralRecommendation.setId(1L);

        int databaseSizeBeforeCreate = mineralRecommendationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMineralRecommendationMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMineralRecommendations() throws Exception {
        // Initialize the database
        mineralRecommendationRepository.saveAndFlush(mineralRecommendation);

        // Get all the mineralRecommendationList
        restMineralRecommendationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mineralRecommendation.getId().intValue())))
            .andExpect(jsonPath("$.[*].minAmount").value(hasItem(DEFAULT_MIN_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].maxAmount").value(hasItem(DEFAULT_MAX_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())))
            .andExpect(jsonPath("$.[*].timePeriodLength").value(hasItem(DEFAULT_TIME_PERIOD_LENGTH.intValue())))
            .andExpect(jsonPath("$.[*].timePeriodDimension").value(hasItem(DEFAULT_TIME_PERIOD_DIMENSION.toString())));
    }

    @Test
    @Transactional
    void getMineralRecommendation() throws Exception {
        // Initialize the database
        mineralRecommendationRepository.saveAndFlush(mineralRecommendation);

        // Get the mineralRecommendation
        restMineralRecommendationMockMvc
            .perform(get(ENTITY_API_URL_ID, mineralRecommendation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mineralRecommendation.getId().intValue()))
            .andExpect(jsonPath("$.minAmount").value(DEFAULT_MIN_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.maxAmount").value(DEFAULT_MAX_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()))
            .andExpect(jsonPath("$.timePeriodLength").value(DEFAULT_TIME_PERIOD_LENGTH.intValue()))
            .andExpect(jsonPath("$.timePeriodDimension").value(DEFAULT_TIME_PERIOD_DIMENSION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMineralRecommendation() throws Exception {
        // Get the mineralRecommendation
        restMineralRecommendationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMineralRecommendation() throws Exception {
        // Initialize the database
        mineralRecommendationRepository.saveAndFlush(mineralRecommendation);

        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();

        // Update the mineralRecommendation
        MineralRecommendation updatedMineralRecommendation = mineralRecommendationRepository.findById(mineralRecommendation.getId()).get();
        // Disconnect from session so that the updates on updatedMineralRecommendation are not directly saved in db
        em.detach(updatedMineralRecommendation);
        updatedMineralRecommendation
            .minAmount(UPDATED_MIN_AMOUNT)
            .maxAmount(UPDATED_MAX_AMOUNT)
            .unit(UPDATED_UNIT)
            .timePeriodLength(UPDATED_TIME_PERIOD_LENGTH)
            .timePeriodDimension(UPDATED_TIME_PERIOD_DIMENSION);

        restMineralRecommendationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMineralRecommendation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMineralRecommendation))
            )
            .andExpect(status().isOk());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
        MineralRecommendation testMineralRecommendation = mineralRecommendationList.get(mineralRecommendationList.size() - 1);
        assertThat(testMineralRecommendation.getMinAmount()).isEqualTo(UPDATED_MIN_AMOUNT);
        assertThat(testMineralRecommendation.getMaxAmount()).isEqualTo(UPDATED_MAX_AMOUNT);
        assertThat(testMineralRecommendation.getUnit()).isEqualTo(UPDATED_UNIT);
        assertThat(testMineralRecommendation.getTimePeriodLength()).isEqualTo(UPDATED_TIME_PERIOD_LENGTH);
        assertThat(testMineralRecommendation.getTimePeriodDimension()).isEqualTo(UPDATED_TIME_PERIOD_DIMENSION);
    }

    @Test
    @Transactional
    void putNonExistingMineralRecommendation() throws Exception {
        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();
        mineralRecommendation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMineralRecommendationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mineralRecommendation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMineralRecommendation() throws Exception {
        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();
        mineralRecommendation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralRecommendationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMineralRecommendation() throws Exception {
        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();
        mineralRecommendation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralRecommendationMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMineralRecommendationWithPatch() throws Exception {
        // Initialize the database
        mineralRecommendationRepository.saveAndFlush(mineralRecommendation);

        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();

        // Update the mineralRecommendation using partial update
        MineralRecommendation partialUpdatedMineralRecommendation = new MineralRecommendation();
        partialUpdatedMineralRecommendation.setId(mineralRecommendation.getId());

        partialUpdatedMineralRecommendation.unit(UPDATED_UNIT).timePeriodDimension(UPDATED_TIME_PERIOD_DIMENSION);

        restMineralRecommendationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMineralRecommendation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMineralRecommendation))
            )
            .andExpect(status().isOk());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
        MineralRecommendation testMineralRecommendation = mineralRecommendationList.get(mineralRecommendationList.size() - 1);
        assertThat(testMineralRecommendation.getMinAmount()).isEqualTo(DEFAULT_MIN_AMOUNT);
        assertThat(testMineralRecommendation.getMaxAmount()).isEqualTo(DEFAULT_MAX_AMOUNT);
        assertThat(testMineralRecommendation.getUnit()).isEqualTo(UPDATED_UNIT);
        assertThat(testMineralRecommendation.getTimePeriodLength()).isEqualTo(DEFAULT_TIME_PERIOD_LENGTH);
        assertThat(testMineralRecommendation.getTimePeriodDimension()).isEqualTo(UPDATED_TIME_PERIOD_DIMENSION);
    }

    @Test
    @Transactional
    void fullUpdateMineralRecommendationWithPatch() throws Exception {
        // Initialize the database
        mineralRecommendationRepository.saveAndFlush(mineralRecommendation);

        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();

        // Update the mineralRecommendation using partial update
        MineralRecommendation partialUpdatedMineralRecommendation = new MineralRecommendation();
        partialUpdatedMineralRecommendation.setId(mineralRecommendation.getId());

        partialUpdatedMineralRecommendation
            .minAmount(UPDATED_MIN_AMOUNT)
            .maxAmount(UPDATED_MAX_AMOUNT)
            .unit(UPDATED_UNIT)
            .timePeriodLength(UPDATED_TIME_PERIOD_LENGTH)
            .timePeriodDimension(UPDATED_TIME_PERIOD_DIMENSION);

        restMineralRecommendationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMineralRecommendation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMineralRecommendation))
            )
            .andExpect(status().isOk());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
        MineralRecommendation testMineralRecommendation = mineralRecommendationList.get(mineralRecommendationList.size() - 1);
        assertThat(testMineralRecommendation.getMinAmount()).isEqualTo(UPDATED_MIN_AMOUNT);
        assertThat(testMineralRecommendation.getMaxAmount()).isEqualTo(UPDATED_MAX_AMOUNT);
        assertThat(testMineralRecommendation.getUnit()).isEqualTo(UPDATED_UNIT);
        assertThat(testMineralRecommendation.getTimePeriodLength()).isEqualTo(UPDATED_TIME_PERIOD_LENGTH);
        assertThat(testMineralRecommendation.getTimePeriodDimension()).isEqualTo(UPDATED_TIME_PERIOD_DIMENSION);
    }

    @Test
    @Transactional
    void patchNonExistingMineralRecommendation() throws Exception {
        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();
        mineralRecommendation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMineralRecommendationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mineralRecommendation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMineralRecommendation() throws Exception {
        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();
        mineralRecommendation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralRecommendationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isBadRequest());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMineralRecommendation() throws Exception {
        int databaseSizeBeforeUpdate = mineralRecommendationRepository.findAll().size();
        mineralRecommendation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralRecommendationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mineralRecommendation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MineralRecommendation in the database
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMineralRecommendation() throws Exception {
        // Initialize the database
        mineralRecommendationRepository.saveAndFlush(mineralRecommendation);

        int databaseSizeBeforeDelete = mineralRecommendationRepository.findAll().size();

        // Delete the mineralRecommendation
        restMineralRecommendationMockMvc
            .perform(delete(ENTITY_API_URL_ID, mineralRecommendation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MineralRecommendation> mineralRecommendationList = mineralRecommendationRepository.findAll();
        assertThat(mineralRecommendationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
