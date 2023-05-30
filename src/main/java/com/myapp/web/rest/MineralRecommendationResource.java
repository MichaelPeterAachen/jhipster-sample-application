package com.myapp.web.rest;

import com.myapp.domain.MineralRecommendation;
import com.myapp.repository.MineralRecommendationRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.MineralRecommendation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MineralRecommendationResource {

    private final Logger log = LoggerFactory.getLogger(MineralRecommendationResource.class);

    private static final String ENTITY_NAME = "mineralRecommendation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MineralRecommendationRepository mineralRecommendationRepository;

    public MineralRecommendationResource(MineralRecommendationRepository mineralRecommendationRepository) {
        this.mineralRecommendationRepository = mineralRecommendationRepository;
    }

    /**
     * {@code POST  /mineral-recommendations} : Create a new mineralRecommendation.
     *
     * @param mineralRecommendation the mineralRecommendation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mineralRecommendation, or with status {@code 400 (Bad Request)} if the mineralRecommendation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mineral-recommendations")
    public ResponseEntity<MineralRecommendation> createMineralRecommendation(@RequestBody MineralRecommendation mineralRecommendation)
        throws URISyntaxException {
        log.debug("REST request to save MineralRecommendation : {}", mineralRecommendation);
        if (mineralRecommendation.getId() != null) {
            throw new BadRequestAlertException("A new mineralRecommendation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MineralRecommendation result = mineralRecommendationRepository.save(mineralRecommendation);
        return ResponseEntity
            .created(new URI("/api/mineral-recommendations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mineral-recommendations/:id} : Updates an existing mineralRecommendation.
     *
     * @param id the id of the mineralRecommendation to save.
     * @param mineralRecommendation the mineralRecommendation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mineralRecommendation,
     * or with status {@code 400 (Bad Request)} if the mineralRecommendation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mineralRecommendation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mineral-recommendations/{id}")
    public ResponseEntity<MineralRecommendation> updateMineralRecommendation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MineralRecommendation mineralRecommendation
    ) throws URISyntaxException {
        log.debug("REST request to update MineralRecommendation : {}, {}", id, mineralRecommendation);
        if (mineralRecommendation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mineralRecommendation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mineralRecommendationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MineralRecommendation result = mineralRecommendationRepository.save(mineralRecommendation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mineralRecommendation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mineral-recommendations/:id} : Partial updates given fields of an existing mineralRecommendation, field will ignore if it is null
     *
     * @param id the id of the mineralRecommendation to save.
     * @param mineralRecommendation the mineralRecommendation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mineralRecommendation,
     * or with status {@code 400 (Bad Request)} if the mineralRecommendation is not valid,
     * or with status {@code 404 (Not Found)} if the mineralRecommendation is not found,
     * or with status {@code 500 (Internal Server Error)} if the mineralRecommendation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mineral-recommendations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MineralRecommendation> partialUpdateMineralRecommendation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MineralRecommendation mineralRecommendation
    ) throws URISyntaxException {
        log.debug("REST request to partial update MineralRecommendation partially : {}, {}", id, mineralRecommendation);
        if (mineralRecommendation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mineralRecommendation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mineralRecommendationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MineralRecommendation> result = mineralRecommendationRepository
            .findById(mineralRecommendation.getId())
            .map(existingMineralRecommendation -> {
                if (mineralRecommendation.getMinAmount() != null) {
                    existingMineralRecommendation.setMinAmount(mineralRecommendation.getMinAmount());
                }
                if (mineralRecommendation.getMaxAmount() != null) {
                    existingMineralRecommendation.setMaxAmount(mineralRecommendation.getMaxAmount());
                }
                if (mineralRecommendation.getUnit() != null) {
                    existingMineralRecommendation.setUnit(mineralRecommendation.getUnit());
                }
                if (mineralRecommendation.getTimePeriodLength() != null) {
                    existingMineralRecommendation.setTimePeriodLength(mineralRecommendation.getTimePeriodLength());
                }
                if (mineralRecommendation.getTimePeriodDimension() != null) {
                    existingMineralRecommendation.setTimePeriodDimension(mineralRecommendation.getTimePeriodDimension());
                }

                return existingMineralRecommendation;
            })
            .map(mineralRecommendationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, mineralRecommendation.getId().toString())
        );
    }

    /**
     * {@code GET  /mineral-recommendations} : get all the mineralRecommendations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mineralRecommendations in body.
     */
    @GetMapping("/mineral-recommendations")
    public List<MineralRecommendation> getAllMineralRecommendations() {
        log.debug("REST request to get all MineralRecommendations");
        return mineralRecommendationRepository.findAll();
    }

    /**
     * {@code GET  /mineral-recommendations/:id} : get the "id" mineralRecommendation.
     *
     * @param id the id of the mineralRecommendation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mineralRecommendation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mineral-recommendations/{id}")
    public ResponseEntity<MineralRecommendation> getMineralRecommendation(@PathVariable Long id) {
        log.debug("REST request to get MineralRecommendation : {}", id);
        Optional<MineralRecommendation> mineralRecommendation = mineralRecommendationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mineralRecommendation);
    }

    /**
     * {@code DELETE  /mineral-recommendations/:id} : delete the "id" mineralRecommendation.
     *
     * @param id the id of the mineralRecommendation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mineral-recommendations/{id}")
    public ResponseEntity<Void> deleteMineralRecommendation(@PathVariable Long id) {
        log.debug("REST request to delete MineralRecommendation : {}", id);
        mineralRecommendationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
