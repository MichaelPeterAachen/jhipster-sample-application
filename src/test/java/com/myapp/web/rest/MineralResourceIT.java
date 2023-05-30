package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Mineral;
import com.myapp.repository.MineralRepository;
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
 * Integration tests for the {@link MineralResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MineralResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/minerals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MineralRepository mineralRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMineralMockMvc;

    private Mineral mineral;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mineral createEntity(EntityManager em) {
        Mineral mineral = new Mineral().name(DEFAULT_NAME);
        return mineral;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mineral createUpdatedEntity(EntityManager em) {
        Mineral mineral = new Mineral().name(UPDATED_NAME);
        return mineral;
    }

    @BeforeEach
    public void initTest() {
        mineral = createEntity(em);
    }

    @Test
    @Transactional
    void createMineral() throws Exception {
        int databaseSizeBeforeCreate = mineralRepository.findAll().size();
        // Create the Mineral
        restMineralMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mineral)))
            .andExpect(status().isCreated());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeCreate + 1);
        Mineral testMineral = mineralList.get(mineralList.size() - 1);
        assertThat(testMineral.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createMineralWithExistingId() throws Exception {
        // Create the Mineral with an existing ID
        mineral.setId(1L);

        int databaseSizeBeforeCreate = mineralRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMineralMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mineral)))
            .andExpect(status().isBadRequest());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMinerals() throws Exception {
        // Initialize the database
        mineralRepository.saveAndFlush(mineral);

        // Get all the mineralList
        restMineralMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mineral.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getMineral() throws Exception {
        // Initialize the database
        mineralRepository.saveAndFlush(mineral);

        // Get the mineral
        restMineralMockMvc
            .perform(get(ENTITY_API_URL_ID, mineral.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mineral.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingMineral() throws Exception {
        // Get the mineral
        restMineralMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMineral() throws Exception {
        // Initialize the database
        mineralRepository.saveAndFlush(mineral);

        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();

        // Update the mineral
        Mineral updatedMineral = mineralRepository.findById(mineral.getId()).get();
        // Disconnect from session so that the updates on updatedMineral are not directly saved in db
        em.detach(updatedMineral);
        updatedMineral.name(UPDATED_NAME);

        restMineralMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMineral.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMineral))
            )
            .andExpect(status().isOk());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
        Mineral testMineral = mineralList.get(mineralList.size() - 1);
        assertThat(testMineral.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingMineral() throws Exception {
        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();
        mineral.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMineralMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mineral.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMineral() throws Exception {
        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();
        mineral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mineral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMineral() throws Exception {
        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();
        mineral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mineral)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMineralWithPatch() throws Exception {
        // Initialize the database
        mineralRepository.saveAndFlush(mineral);

        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();

        // Update the mineral using partial update
        Mineral partialUpdatedMineral = new Mineral();
        partialUpdatedMineral.setId(mineral.getId());

        partialUpdatedMineral.name(UPDATED_NAME);

        restMineralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMineral.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMineral))
            )
            .andExpect(status().isOk());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
        Mineral testMineral = mineralList.get(mineralList.size() - 1);
        assertThat(testMineral.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateMineralWithPatch() throws Exception {
        // Initialize the database
        mineralRepository.saveAndFlush(mineral);

        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();

        // Update the mineral using partial update
        Mineral partialUpdatedMineral = new Mineral();
        partialUpdatedMineral.setId(mineral.getId());

        partialUpdatedMineral.name(UPDATED_NAME);

        restMineralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMineral.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMineral))
            )
            .andExpect(status().isOk());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
        Mineral testMineral = mineralList.get(mineralList.size() - 1);
        assertThat(testMineral.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingMineral() throws Exception {
        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();
        mineral.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMineralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mineral.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mineral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMineral() throws Exception {
        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();
        mineral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mineral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMineral() throws Exception {
        int databaseSizeBeforeUpdate = mineralRepository.findAll().size();
        mineral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMineralMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mineral)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mineral in the database
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMineral() throws Exception {
        // Initialize the database
        mineralRepository.saveAndFlush(mineral);

        int databaseSizeBeforeDelete = mineralRepository.findAll().size();

        // Delete the mineral
        restMineralMockMvc
            .perform(delete(ENTITY_API_URL_ID, mineral.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mineral> mineralList = mineralRepository.findAll();
        assertThat(mineralList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
